import { useState } from 'react';
import { Interface } from '@ethersproject/abi';
import { Log } from 'alchemy-sdk';
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

  const tokensPool = useContract({
    address: tokensPoolAddress,
    abi: tokensPoolAbi,
    signerOrProvider: signer || provider,
  }) as unknown as TokensPool;

  const hasPendingRequest = (address: Address) => {
    return contract.hasPendingRequest(address);
  };

  const isOracleResponseReady = (address: Address) => {
    return contract.isOracleResponseReady(address);
  };

  const burnTicket = async () => {
    const tx = await contract.burnTicket();
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

    const filter = tokensPool.filters.PrizeSent(user);
    const allEvents = await fetchEvent(filter);

    const events = await Promise.all(
      allEvents.map(async ({ ...log }: Log) => {
        const logParsed = tokensPoolIface.parseLog(log);
        const block = await provider.getBlock(log.blockNumber);

        let tokenName = '';
        if (logParsed.args.tokenAddress === addresses.ISaverAvatars) {
          tokenName = 'iSaver Avatar';
        } else if (logParsed.args.tokenAddress === addresses.ISaverPowers) {
          tokenName = 'iSaver Powers';
        } else if (logParsed.args.tokenAddress === addresses.ISaverSAVRToken) {
          tokenName = 'iSaver Reward';
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
    getAllUserPrizes,
    isGetPrizeConfirmed,
    setIsGetPrizeConfirmed,
  };
};
