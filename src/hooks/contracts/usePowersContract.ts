import { useAccount, useContract, useProvider, useSigner } from 'wagmi';

import { ISaverPowers } from '@/types.common';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const usePowersContract = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: powersAddress, abi } = useContractAbi({
    contract: ContractsEnum.ISaverPowers,
  });

  const contract = useContract({
    address: powersAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as ISaverPowers;

  const getBalanceOf = async (powerId: number) => {
    return address ? await contract.balanceOf(address, powerId) : null;
  };

  return {
    powersContract: contract,
    getBalanceOf,
  };
};
