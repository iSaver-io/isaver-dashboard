import { Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK } from '@/constants';
import alchemy from '@/modules/alchemy';
import { Ticket } from '@/types.common';
import { TransferSingleEvent } from '@/types/typechain-types/contracts/tokens/Ticket';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useTicketContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Ticket,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as Ticket;

  const balanceOf = (account: string, tokenId: number = 0) => {
    return contract.balanceOf(account, tokenId);
  };

  const totalSupply = (tokenId: number = 0) => {
    return contract.totalSupply(tokenId);
  };

  const getAllMintTransfers = async () => {
    const filter = contract.filters.TransferSingle(null, ethers.constants.AddressZero);

    const transferLogs = await alchemy.core.getLogs({
      ...filter,
      fromBlock: FROM_BLOCK,
      toBlock: 'latest',
    });

    const ticketIface = new Interface(abi);
    const parsed: ({ args: TransferSingleEvent } & any)[] = transferLogs.map((e) =>
      ticketIface.parseLog(e)
    );
    return parsed;
  };

  const isApprovedForAll = (account: string, operator: string) => {
    return contract.isApprovedForAll(account, operator);
  };
  const setApprovalForAll = async (operator: string, isApproved: boolean) => {
    const tx = await contract.setApprovalForAll(operator, isApproved);
    return waitForTransaction(tx);
  };

  const mintTickets = async ({ address, amount }: { address: string; amount: number }) => {
    const tx = await contract.mint(address, 0, amount, ethers.utils.toUtf8Bytes(''));
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,

    getAllMintTransfers,
    totalSupply,
    balanceOf,
    isApprovedForAll,
    setApprovalForAll,
    mintTickets,
  };
};
