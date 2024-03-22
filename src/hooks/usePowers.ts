import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount, useQuery } from 'wagmi';

import { useAccounts } from './admin/useAccounts';
import { useContractsAddresses } from './admin/useContractsAddresses';
import { usePowersContract } from './contracts/usePowersContract';

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

export const POWER_SUPPLY_REQUEST = 'power-supply-request';
export const POWER_CIRCULATION_SUPPLY_REQUEST = 'power-circulation-supply-request';
export const POWER_TOTAL_MINTED_REQUEST = 'power-total-minted-request';
export const usePowerSupply = (tokenId: number) => {
  const powersContract = usePowersContract();

  const accounts = useAccounts();
  const contracts = useContractsAddresses();

  const uniqueSystemAddresses = useMemo(
    () => Array.from(new Set([...Object.values(accounts), ...Object.values(contracts)])),
    [accounts, contracts]
  );

  const currentSupply = useQuery([POWER_SUPPLY_REQUEST, tokenId], () =>
    powersContract.getTotalSupply(tokenId)
  );

  const totalMinted = useQuery(
    [POWER_TOTAL_MINTED_REQUEST, tokenId],
    () => powersContract.getAllMintTransfers(),
    {
      select: (data) =>
        data.reduce((acc, transfer) => {
          acc += transfer.args.value.toNumber();
          return acc;
        }, 0),
    }
  );

  const balances = useQueries({
    queries: uniqueSystemAddresses.map((address) => ({
      queryKey: [POWER_CIRCULATION_SUPPLY_REQUEST, address],
      queryFn: () => powersContract.getBalanceOf(address, tokenId),
    })),
  });

  const totalBurned = useMemo(() => {
    if (totalMinted.data === undefined || currentSupply.data === undefined) return undefined;
    return totalMinted.data - currentSupply.data?.toNumber();
  }, [totalMinted.data, currentSupply.data]);

  const circulatingSupply = useMemo(() => {
    if (!currentSupply.data) return 0;
    return balances
      .reduce((sum, balanceRequest) => {
        if (balanceRequest.data) return sum.sub(balanceRequest.data);
        return sum;
      }, currentSupply.data)
      .toNumber();
  }, [currentSupply.data, balances]);

  const isLoading = useMemo(
    () =>
      totalBurned === undefined ||
      circulatingSupply === undefined ||
      totalMinted.isLoading ||
      currentSupply.isLoading,
    [totalBurned, circulatingSupply, totalMinted.isLoading, currentSupply.isLoading]
  );

  return {
    isLoading,
    currentSupply: currentSupply.data,
    circulatingSupply,
    totalMinted: totalMinted.data,
    totalBurned,
  };
};
