import { useContract, useProvider, useSigner } from 'wagmi';

import { Momento } from '@/types.common';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useMomentoContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Momento,
  });
  const { address: tokensPoolAddress, abi: tokensPoolAbi } = useContractAbi({
    contract: ContractsEnum.MomentoTokensPool,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as Momento;

  const hasPendingRequest = (address: string) => {
    return contract.hasPendingRequest(address);
  };

  const isOracleResponseReady = (address: string) => {
    return contract.isOracleResponseReady(address);
  };

  const burnTicket = async () => {
    const tx = await contract.burnTicket();
    return waitForTransaction(tx);
  };

  const getPrize = async () => {
    const tx = await contract.getPrize({ gasLimit: 15000000 });
    const hash = await waitForTransaction(tx);
    const receipt = provider.getTransactionReceipt(hash);
    return receipt;
  };

  return {
    tokensPoolAddress,
    tokensPoolAbi,
    abi,
    contract,
    address: contractAddress,
    hasPendingRequest,
    isOracleResponseReady,
    burnTicket,
    getPrize,
  };
};
