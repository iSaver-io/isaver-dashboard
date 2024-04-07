// eslint-disable-next-line
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { useAccounts } from './admin/useAccounts';
import { useContractsAddresses } from './admin/useContractsAddresses';
import { usePowersContract } from './contracts/usePowersContract';
import { useNotification } from './useNotification';

export const POWERS_LIST = ['A', 'B', 'C', 'D'];

export const GET_POWER_BALANCE = 'get-power-balance';
export const usePowerBalance = (powerId: number) => {
  const { address } = useAccount();
  const { getBalanceOf } = usePowersContract();

  const { data: balance } = useQuery([GET_POWER_BALANCE, address, powerId], async () =>
    address ? await getBalanceOf(address, powerId) : null
  );

  return balance || BigNumber.from(0);
};

export const usePowersSupply = () => {
  const supplyPowerA = usePowerSupply(0);
  const supplyPowerB = usePowerSupply(1);
  const supplyPowerC = usePowerSupply(2);
  const supplyPowerD = usePowerSupply(3);

  const { supply, isLoading } = useMemo(
    () => ({
      supply: { 0: supplyPowerA, 1: supplyPowerB, 2: supplyPowerC, 3: supplyPowerD },
      isLoading:
        supplyPowerA.isLoading ||
        supplyPowerB.isLoading ||
        supplyPowerC.isLoading ||
        supplyPowerD.isLoading,
    }),
    [supplyPowerA, supplyPowerB, supplyPowerC, supplyPowerD]
  );

  return { supply, isLoading };
};

const usePowersMintedEvents = () => {
  const powersContract = usePowersContract();

  const totalMintedRequest = useQuery(
    [POWER_TOTAL_MINTED_REQUEST],
    () => powersContract.getAllMintTransfers(),
    {
      select: (data) =>
        data.reduce((acc, transfer) => {
          if (transfer.name === 'TransferBatch') {
            transfer.args.ids.map((id: BigNumber) => {
              const powerId = id.toNumber();
              const amount = transfer.args[4][powerId].toNumber();
              acc[powerId] += amount;
            });
          } else {
            const powerId = transfer.args.id.toNumber();
            const amount = transfer.args[4].toNumber();
            acc[powerId] += amount;
          }

          return acc;
        }, Array.from({ length: POWERS_LIST.length }).fill(0) as number[]),
    }
  );

  return { totalMinted: totalMintedRequest.data, isLoading: totalMintedRequest.isLoading };
};

export const POWER_SUPPLY_REQUEST = 'power-supply-request';
export const POWER_CIRCULATION_SUPPLY_REQUEST = 'power-circulation-supply-request';
export const POWER_TOTAL_MINTED_REQUEST = 'power-total-minted-request';
export const usePowerSupply = (tokenId: number) => {
  const powersContract = usePowersContract();

  const accounts = useAccounts();
  const contracts = useContractsAddresses();

  const { totalMinted, isLoading: isLoadingTotalMinted } = usePowersMintedEvents();

  const powerTotalMinted = useMemo(
    () => (totalMinted ? totalMinted[tokenId] : undefined),
    [totalMinted, tokenId]
  );

  const uniqueSystemAddresses = useMemo(
    () => Array.from(new Set([...Object.values(accounts), ...Object.values(contracts)])),
    [accounts, contracts]
  );

  const currentSupply = useQuery([POWER_SUPPLY_REQUEST, { tokenId }], () =>
    powersContract.getTotalSupply(tokenId)
  );

  const systemBalances = useQueries({
    queries: uniqueSystemAddresses.map((systemAddress) => ({
      queryKey: [POWER_CIRCULATION_SUPPLY_REQUEST, { tokenId, address: systemAddress }],
      queryFn: () => powersContract.getBalanceOf(systemAddress, tokenId),
    })),
  });

  const totalBurned = useMemo(() => {
    if (powerTotalMinted === undefined || currentSupply.data === undefined) return undefined;
    return powerTotalMinted - currentSupply.data?.toNumber();
  }, [powerTotalMinted, currentSupply.data]);

  const circulatingSupply = useMemo(() => {
    if (!currentSupply.data) return 0;
    return systemBalances
      .reduce((sum, balanceRequest) => {
        if (balanceRequest.data) return sum.sub(balanceRequest.data);
        return sum;
      }, currentSupply.data)
      .toNumber();
  }, [currentSupply.data, systemBalances]);

  const isCirculatingSupplyLoading = useMemo(
    () =>
      circulatingSupply === undefined ||
      currentSupply.isLoading ||
      systemBalances.some((req) => req.isLoading),
    [circulatingSupply, currentSupply.isLoading, systemBalances]
  );

  const isLoading = useMemo(
    () => totalBurned === undefined || isCirculatingSupplyLoading || isLoadingTotalMinted,
    [totalBurned, isLoadingTotalMinted, isCirculatingSupplyLoading]
  );

  return {
    isLoading,
    isCirculatingSupplyLoading,
    currentSupply: currentSupply.data,
    circulatingSupply,
    totalMinted: powerTotalMinted,
    totalBurned,
  };
};

export const usePowerControl = () => {
  const powersContract = usePowersContract();
  const queryClient = useQueryClient();

  const { success, handleError } = useNotification();

  const mintPowers = useMutation(
    ['mint-powers'],
    async ({
      tokenId,
      toAddress,
      amount,
    }: {
      tokenId: number;
      toAddress: string;
      amount: number;
    }) => {
      const txHash = await powersContract.mintPowers(tokenId, toAddress, amount);
      success({
        title: 'Success',
        description: `${amount} powers with id ${tokenId} minted to ${toAddress}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [POWER_SUPPLY_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [POWER_CIRCULATION_SUPPLY_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [POWER_TOTAL_MINTED_REQUEST] });
      },
      onError: (err) => handleError(err, 'powers'),
    }
  );

  return { mintPowers };
};
