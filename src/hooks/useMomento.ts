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
        return prizeSentEvent.args as unknown as PrizeInfo;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([HAS_PENDING_REQUEST, { address }]);
        queryClient.invalidateQueries([ORACLE_RESPONSE_REQUEST, { address }]);
        queryClient.invalidateQueries([TICKET_BALANCE_REQUEST, { address }]);
        queryClient.invalidateQueries([GET_ALL_USER_PRIZES, { address }]);
      },
      onSettled: () => {
        momentoContract.setIsGetPrizeConfirmed(false);
      },
      onError: handleError,
    }
  );

  return {
    isOracleResponseReady,
    isGetPrizeConfirmed: momentoContract.isGetPrizeConfirmed,
    hasPendingRequest,
    burnTicket,
    getPrize,
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
