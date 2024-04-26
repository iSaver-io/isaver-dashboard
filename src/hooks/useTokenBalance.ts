import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { erc20ABI, useAccount, useContract, useProvider, useSigner } from 'wagmi';

import { ISaverSAVToken } from '@/types';
import { getBalanceHistoryFromTransfers } from '@/utils/balance';

import { ContractsEnum } from './contracts/useContractAbi';
import { useTokenContract } from './contracts/useTokenContract';
import { useUsdtTokenContract } from './contracts/useUsdtTokenContract';

export const SAV_BALANCE_REQUEST = 'token-balance-sav';
export const useSavBalance = (address?: string) => {
  const savContract = useTokenContract(ContractsEnum.SAV);

  return useQuery([SAV_BALANCE_REQUEST, { address }], async () => {
    return address ? await savContract.balanceOf(address) : null;
  });
};

export const SAVR_BALANCE_REQUEST = 'token-balance-savr';
export const useSavRBalance = (address?: string) => {
  const savrContract = useTokenContract(ContractsEnum.SAVR);

  return useQuery([SAVR_BALANCE_REQUEST, { address }], async () => {
    return address ? await savrContract.balanceOf(address) : null;
  });
};

export const USDT_BALANCE_REQUEST = 'token-balance-usdt';
export const useUsdtBalance = (address?: string) => {
  const usdtContract = useUsdtTokenContract();

  return useQuery([USDT_BALANCE_REQUEST, { address }], async () => {
    return address ? await usdtContract.balanceOf(address) : null;
  });
};

export const TOKEN_BALANCE_REQUEST = 'token-balance-request';
export const useTokenBalance = (tokenAddress?: string, address?: string) => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const contract = useContract({
    address: tokenAddress,
    abi: erc20ABI,
    signerOrProvider: signer || provider,
  }) as unknown as ISaverSAVToken;

  return useQuery(
    [TOKEN_BALANCE_REQUEST, { tokenAddress, address }],
    async () => {
      return address ? contract.balanceOf(address) : null;
    },
    { enabled: Boolean(tokenAddress) && Boolean(address) }
  );
};

export const BALANCE_HISTORY_REQUEST = 'token-balance-history';
export const useTokenBalanceHistory = () => {
  const savContract = useTokenContract(ContractsEnum.SAV);
  const savrContract = useTokenContract(ContractsEnum.SAVR);
  const { address } = useAccount();
  const provider = useProvider();
  const savBalance = useSavBalance(address);
  const savrBalance = useSavRBalance(address);

  const transfersHistoryRequest = useQuery(
    [SAV_BALANCE_REQUEST, SAVR_BALANCE_REQUEST, BALANCE_HISTORY_REQUEST, { address }],
    async () => {
      if (!address) return null;

      return await Promise.all([
        savContract.getBalanceHistoryTransfers(address),
        savrContract.getBalanceHistoryTransfers(address),
      ]);
    },
    { enabled: Boolean(address) }
  );

  const balanceHistory = useMemo(() => {
    if (transfersHistoryRequest.data && savBalance.data && savrBalance.data && address) {
      return getBalanceHistoryFromTransfers(
        transfersHistoryRequest.data[0],
        transfersHistoryRequest.data[1],
        savBalance.data,
        savrBalance.data,
        provider.blockNumber,
        address
      );
    }
    return [];
  }, [savBalance.data, savrBalance.data, transfersHistoryRequest.data, address, provider]);

  return { transfersHistoryRequest, balanceHistory };
};
