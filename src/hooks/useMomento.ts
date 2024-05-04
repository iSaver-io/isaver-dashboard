import { useMemo } from 'react';
import { Interface } from '@ethersproject/abi';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { NftTokenType } from 'alchemy-sdk';
import { Address, useAccount } from 'wagmi';

import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { useMomentoContract } from '@/hooks/contracts/useMomentoContract';
import { useTicketContract } from '@/hooks/contracts/useTicketContract';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useNotification } from '@/hooks/useNotification';
import alchemy from '@/modules/alchemy';

import {
  TOKENS_POOL_NFT_PRIZES_REQUEST,
  useTokensPoolNFTPrizes,
} from './admin/useTokensPoolControl';
import { ContractsEnum } from './contracts/useContractAbi';
import { TICKET_BALANCE_REQUEST } from './useTicketsBalance';

const HAS_PENDING_REQUEST = 'has-pending-request';
const ORACLE_RESPONSE_REQUEST = 'oracle-response-request';
const BURN_TICKET_MUTATION = 'burn-ticket-mutation';
const GET_PRIZE_MUTATION = 'get-prize-mutation';

export type PrizeInfo = {
  sender: Address;
  tokenAddress: Address;
  isERC20: boolean;
  isERC721: boolean;
  isERC1155: boolean;
  tokenId: bigint;
  amount: bigint;
};

export const useMomento = () => {
  const { address } = useAccount();
  const momentoContract = useMomentoContract();
  const ticketContract = useTicketContract();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();
  const contractAddresses = useContractsAddresses();

  const { data: hasPendingRequest } = useQuery(
    [HAS_PENDING_REQUEST, { address }],
    async () => (address ? await momentoContract.hasPendingRequest(address) : null),
    { refetchInterval: 5000 }
  );

  const { data: isOracleResponseReady } = useQuery(
    [ORACLE_RESPONSE_REQUEST, { address }],
    async () => (address ? await momentoContract.isOracleResponseReady(address) : null),
    { refetchInterval: 5000 }
  );

  const burnTicket = useMutation(
    [BURN_TICKET_MUTATION],
    async () => {
      if (!address) {
        connect();
        return;
      }
      const isApproved = await ticketContract.isApprovedForAll(address, momentoContract.address);
      if (!isApproved) {
        const approveTx = await ticketContract.setApprovalForAll(momentoContract.address, true);
        success({ title: 'Approved', txHash: approveTx });
      }

      const txHash = await momentoContract.burnTicket();
      success({
        title: 'Success',
        description: 'Your Ticket has been burned',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([TICKET_BALANCE_REQUEST, { address }]);
        queryClient.invalidateQueries([HAS_PENDING_REQUEST, { address }]);
        queryClient.invalidateQueries([ORACLE_RESPONSE_REQUEST, { address }]);
      },
      onSettled: () => {
        momentoContract.setIsBurnTicketConfirmed(false);
      },
      onError: (err) => handleError(err, 'momento'),
    }
  );

  const getPrize = useMutation<PrizeInfo | undefined>(
    [GET_PRIZE_MUTATION],
    async () => {
      if (!address) {
        connect();
        return;
      }

      const receipt = await momentoContract.getPrize();

      success({
        title: 'Success',
        description: 'Congrats! The prize has been sent to your wallet',
        txHash: receipt.transactionHash,
      });

      const tokensPoolInterface = new Interface(momentoContract.tokensPoolAbi);
      const prizeSentLog = receipt.logs.find(
        (log) => log.address === momentoContract.tokensPoolAddress
      );

      if (prizeSentLog) {
        const prizeSentEvent = tokensPoolInterface.parseLog(prizeSentLog);
        const prizeInfo = prizeSentEvent.args as unknown as PrizeInfo;
        // Если приз сторонней коллекции НФТ, то обновляем список призов
        if (
          (prizeInfo.isERC1155 || prizeInfo.isERC721) &&
          !Object.values(contractAddresses).includes(prizeInfo.tokenAddress)
        ) {
          queryClient.invalidateQueries([TOKENS_POOL_NFT_PRIZES_REQUEST]);
        }
        return prizeInfo;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([HAS_PENDING_REQUEST, { address }]);
        queryClient.invalidateQueries([ORACLE_RESPONSE_REQUEST, { address }]);
        queryClient.invalidateQueries([GET_ALL_USER_PRIZES, { address }]);
        setTimeout(
          () => queryClient.invalidateQueries([TICKET_BALANCE_REQUEST, { address }]),
          5000
        );
      },
      onSettled: () => {
        momentoContract.setIsGetPrizeConfirmed(false);
      },
      onError: (err) => handleError(err, 'momento'),
    }
  );

  return {
    isOracleResponseReady,
    isBurnTicketConfirmed: momentoContract.isBurnTicketConfirmed,
    isGetPrizeConfirmed: momentoContract.isGetPrizeConfirmed,
    hasPendingRequest,
    burnTicket,
    getPrize,
  };
};
const MOMENTO_TOTAL_BURNED_TICKETS_REQUEST = 'momento-total-burned-tickets';
export const useMomentoControl = () => {
  const momentoContract = useMomentoContract();

  const totalBurnedTicketsRequest = useQuery([MOMENTO_TOTAL_BURNED_TICKETS_REQUEST], () =>
    momentoContract.getTotalBurnedTickets()
  );

  return { totalBurnedTicketsRequest };
};

export const GET_MOMENTO_PRIZES = 'get-momento-prizes-request';
export const GET_MOMENTO_EXTERNAL_PRIZES = 'get-momento-external-prizes-request';
export const useMomentoNFTPrizes = () => {
  const addresses = useContractsAddresses();

  const { prizesRequest } = useTokensPoolNFTPrizes(ContractsEnum.MomentoTokensPool);

  const externalNFTAddresses = useMemo(() => {
    // const nfts = (prizesRequest.data || [])
    //   .filter((category) => !category.info.isEmpty)
    //   .sort((a, b) => a.info.chance.sub(b.info.chance).toNumber())
    //   .map((category) => category.prizes)
    //   .flat()
    //   .filter(
    //     (prize) =>
    //       (prize.isERC721 || prize.isERC1155) &&
    //       !Object.values(addresses).includes(prize.tokenAddress)
    //   )
    //   .map((category) =>
    //     category.tokenIds.map((tokenId) => ({ ...category, tokenId: tokenId.toString() }))
    //   );
    if (!prizesRequest.data || !prizesRequest.data.length) return [];

    const prizes = prizesRequest.data
      .filter((category) => !category.info.isEmpty)
      .sort((a, b) => a.info.chance.sub(b.info.chance).toNumber())
      .map((category) => ({
        ...category,
        prizes: category.prizes
          .filter(
            (prize) =>
              (prize.isERC721 || prize.isERC1155) &&
              !Object.values(addresses).includes(prize.tokenAddress) &&
              prize.remaining.gt(0)
          )
          .map((prize) =>
            prize.tokenIds.map((tokenId) => ({ ...prize, tokenId: tokenId.toString() }))
          )
          .reverse(),
      }));

    const mainCategory = prizes.filter(({ categoryId }) => categoryId === 35)[0].prizes;
    const secondaryCategory = prizes.filter(({ categoryId }) => categoryId === 11)[0].prizes;

    const MAX_NFTS = Math.min(14, mainCategory.length + secondaryCategory.length);
    const selectedNFTs = mainCategory.flat();

    for (let i = 0; selectedNFTs.length < MAX_NFTS; i++) {
      const collectionIndex = i % secondaryCategory.length;
      const tokenIndex = Math.floor(i / secondaryCategory.length);

      if (secondaryCategory[collectionIndex].length < tokenIndex) {
        continue;
      }

      selectedNFTs.push(secondaryCategory[collectionIndex][tokenIndex]);
    }

    return selectedNFTs;
  }, [addresses, prizesRequest.data]);

  const externalNFTRequests = useQueries({
    queries: externalNFTAddresses.map((nft) => ({
      queryKey: [GET_MOMENTO_EXTERNAL_PRIZES, nft.tokenAddress, nft.tokenId],
      queryFn: async () =>
        await alchemy.nft.getNftMetadata(nft.tokenAddress, nft.tokenId, {
          tokenType: nft.isERC721 ? NftTokenType.ERC721 : NftTokenType.ERC1155,
          refreshCache: true,
        }),
    })),
  });

  const externalNFTs = useMemo(
    () => externalNFTRequests.map((req) => req.data).filter((data) => Boolean(data)),
    [externalNFTRequests]
  );

  const isLoadingExternalNFT = useMemo(
    () => externalNFTRequests.some((req) => !req.isFetched),
    [externalNFTRequests]
  );

  return {
    momentoPrizesRequest: prizesRequest,
    externalNFTs,
    isLoading: prizesRequest.isLoading || isLoadingExternalNFT,
  };
};

export const GET_ALL_USER_PRIZES = 'get-all-user-prizes';
export const useAllUserPrizes = () => {
  const { address } = useAccount();
  const { getAllUserPrizes } = useMomentoContract();

  return useQuery(
    [GET_ALL_USER_PRIZES, { address }],
    async () => (address ? await getAllUserPrizes(address) : []),
    { refetchInterval: 60_000, initialData: [], placeholderData: [] }
  );
};

export const GET_NFT = 'get-nft';
export const useGetNFT = (
  contractAddress: Address,
  tokenId: number | bigint,
  tokenType: NftTokenType.ERC721 | NftTokenType.ERC1155 = NftTokenType.ERC721
) => {
  const { data } = useQuery(
    [GET_NFT, contractAddress, tokenId.toString()],
    async () => {
      return await alchemy.nft.getNftMetadata(contractAddress, tokenId, {
        tokenType,
        refreshCache: true,
      });
    },
    {
      cacheTime: 0,
      staleTime: 0,
    }
  );

  return {
    nft: data,
  };
};
