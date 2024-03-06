import { Interface } from '@ethersproject/abi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NftTokenType } from 'alchemy-sdk';
import { Address, useAccount } from 'wagmi';

import { useTicketContract } from '@/hooks/contracts/useTicketContract';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useNotification } from '@/hooks/useNotification';
import alchemy from '@/modules/alchemy';

import { useMomentoContract } from './contracts/useMomentoContract';
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
      onError: handleError,
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

      const tokensPoolInterface = new Interface(momentoContract.tokensPoolAbi);
      const prizeSentLog = receipt.logs.find(
        (log) => log.address === momentoContract.tokensPoolAddress
      );
      if (prizeSentLog) {
        const prizeSentEvent = tokensPoolInterface.parseLog(prizeSentLog);
        return prizeSentEvent.args as unknown as PrizeInfo;
      }

      success({
        title: 'Success',
        description: 'Congrats! The prize has been sent to your wallet',
        txHash: receipt.transactionHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([HAS_PENDING_REQUEST, { address }]);
        queryClient.invalidateQueries([ORACLE_RESPONSE_REQUEST, { address }]);
        queryClient.invalidateQueries([TICKET_BALANCE_REQUEST, { address }]);
      },
      onError: handleError,
    }
  );

  return {
    isOracleResponseReady,
    hasPendingRequest,
    burnTicket,
    getPrize,
  };
};

export const GET_ALL_PRIZES = 'get-all-prizes';
export const useAllPrizes = () => {
  const { address } = useAccount();
  const { getAllPrizes } = useMomentoContract();

  const eventsRequest = useQuery(
    [GET_ALL_PRIZES, { address }],
    async () => (address ? await getAllPrizes(address) : []),
    { staleTime: 0, cacheTime: 0, refetchInterval: 60_000, initialData: [], placeholderData: [] }
  );

  return eventsRequest;
};

export const GET_NFT = 'get-nft';
export const useGetNFT = (contractAddress: Address, tokenId: number) => {
  const { data } = useQuery(
    [GET_NFT, tokenId],
    async () => {
      return await alchemy.nft.getNftMetadata(contractAddress, tokenId, {
        tokenType: NftTokenType.ERC721,
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
