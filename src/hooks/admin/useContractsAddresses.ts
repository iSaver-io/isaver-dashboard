import Contracts from '@/config/contracts.json';
import { useChainId } from '@/hooks/contracts/useChainId';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';

export const useContractsAddresses = () => {
  let chainId = useChainId();

  const { contracts } = (Contracts as any)[chainId][0];

  const data = Object.entries(contracts).reduce(
    (acc, [key, value]) => {
      acc[key as ContractsEnum] = (value as any).address;
      return acc;
    },
    { TokenVesting_OLD: '0xC63373f8564B92A0bFC4DB0123F065D638863BFF' } as Record<
      ContractsEnum,
      string
    >
  );

  return data;
};
