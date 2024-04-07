import { useState } from 'react';
import { Interface } from '@ethersproject/abi';
import { Log } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { Address, useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK_EPISODE_2 } from '@/constants';
import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import alchemy from '@/modules/alchemy';
import { Momento, TokensPool } from '@/types.common';
import { TypedEvent, TypedEventFilter } from '@/types/typechain-types/common';
import { bigNumberToString } from '@/utils/number';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useMomentoContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const [isBurnTicketConfirmed, setIsBurnTicketConfirmed] = useState(false);
  const [isGetPrizeConfirmed, setIsGetPrizeConfirmed] = useState(false);
  const addresses = useContractsAddresses();

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

  const tokensPoolContract = useContract({
    address: tokensPoolAddress,
    abi: tokensPoolAbi,
    signerOrProvider: signer || provider,
  }) as unknown as TokensPool;

  const getTotalBurnedTickets = () => {
    return contract.totalBurnedTickets();
  };

  const hasPendingRequest = (address: Address) => {
    return contract.hasPendingRequest(address);
  };

  const isOracleResponseReady = (address: Address) => {
    return contract.isOracleResponseReady(address);
  };

  const burnTicket = async () => {
    const tx = await contract.burnTicket();
    setIsBurnTicketConfirmed(true);
    return waitForTransaction(tx);
  };

  const getPrize = async () => {
    const tx = await contract.getPrize({ gasLimit: 15000000 });
    setIsGetPrizeConfirmed(true);
    const hash = await waitForTransaction(tx);
    const receipt = provider.getTransactionReceipt(hash);
    return receipt;
  };

  const getAllUserPrizes = async (user: Address) => {
    const tokensPoolIface = new Interface(tokensPoolAbi);

    const fetchEvent = async (filter: TypedEventFilter<TypedEvent<Event[]>>) => {
      try {
        return await alchemy.core.getLogs({
          ...filter,
          fromBlock: FROM_BLOCK_EPISODE_2,
          toBlock: 'latest',
        });
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    };

    const filter = tokensPoolContract.filters.PrizeSent(user);
    const allEvents = await fetchEvent(filter);

    const events = await Promise.all(
      allEvents.map(async ({ ...log }: Log) => {
        const logParsed = tokensPoolIface.parseLog(log);
        const block = await provider.getBlock(log.blockNumber);

        let tokenName = '';
        if (logParsed.args.tokenAddress === addresses.ISaverAvatars) {
          tokenName = 'iSaver Avatar';
        } else if (logParsed.args.tokenAddress === addresses.ISaverPowers) {
          tokenName = 'iSaver Powers ' + ['A', 'B', 'C', 'D'][logParsed.args.tokenId.toNumber()];
        } else if (logParsed.args.tokenAddress === addresses.ISaverSAVRToken) {
          tokenName = 'SAVR';
        } else if (logParsed.args.tokenAddress === addresses.Ticket) {
          tokenName = 'iSaver Raffle Ticket';
        } else {
          const tokenMetadata = await alchemy.core.getTokenMetadata(logParsed.args.tokenAddress);
          tokenName = tokenMetadata.name || 'Unknown token';
        }

        const label = (
          logParsed.args.isERC20 || logParsed.args.isERC1155
            ? `${
                logParsed.args.isERC20
                  ? bigNumberToString(logParsed.args.amount, { precision: 0 })
                  : logParsed.args.amount.toString()
              } ${tokenName}`
            : tokenName
        ) as string;

        return {
          transactionHash: log.transactionHash,
          label,
          timestamp: block.timestamp,
        };
      })
    );

    const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);

    return sortedEvents;
  };

  const getMomentoPrizes = async () => {
    const nonEmptyResponse = await tokensPoolContract.getNonEmptyCategories();
    const nonEmptyCategories = nonEmptyResponse.map((val: any) => val.toNumber());

    return await Promise.all(
      nonEmptyCategories.map(async (categoryId) => {
        const prizesResponse = await tokensPoolContract.getCategoryPrizes(categoryId);
        return prizesResponse.map((val: any) => ({
          tokenAddress: val[0],
          isERC20: val[1],
          isERC721: val[2],
          isERC1155: val[3],
          amount: val[1] ? ethers.utils.formatEther(val[4].toString()) : val[4].toNumber(),
          tokenIds: val[5].map((val: any) => val.toString()),
          remaining: val[6].toNumber(),
        }));
      })
    );
  };

  return {
    tokensPoolAddress,
    tokensPoolAbi,
    tokensPoolContract,
    getMomentoPrizes,
    getTotalBurnedTickets,
    abi,
    contract,
    address: contractAddress,
    hasPendingRequest,
    isOracleResponseReady,
    burnTicket,
    getPrize,
    getAllUserPrizes,
    isBurnTicketConfirmed,
    setIsBurnTicketConfirmed,
    isGetPrizeConfirmed,
    setIsGetPrizeConfirmed,
  };
};
