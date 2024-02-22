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

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as Momento;

  const isTicketBurned = (address: string) => {
    return contract.ticketBurned(address);
  };

  const isOracleResponseReady = (address: string) => {
    return contract.isOracleResponseReady(address);
  };

  const burnTicket = async () => {
    const tx = await contract.burnTicket();
    return waitForTransaction(tx);
  };

  const getPrize = async () => {
    const tx = await contract.getPrize();
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    isTicketBurned,
    isOracleResponseReady,
    burnTicket,
    getPrize,
  };
};
