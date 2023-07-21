import EthDater from 'ethereum-block-by-date';
import { ethers } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK } from '@/constants';
import { Ticket } from '@/types.common';
import { queryThrowBlocks } from '@/utils/queryThrowBlocks';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useTicketContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const dater = new EthDater(provider);

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
    const { block: toBlock } = await dater.getDate(new Date());
    const filter = contract.filters.TransferSingle(null, ethers.constants.AddressZero);

    const fetchEvents = (from: number, to: number) => contract.queryFilter(filter, from, to);

    return await queryThrowBlocks(fetchEvents, { fromBlock: FROM_BLOCK, toBlock });
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
