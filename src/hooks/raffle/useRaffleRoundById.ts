import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumberish } from 'ethers';
import { useAccount } from 'wagmi';

import { useRaffleContract } from '@/hooks/contracts/useRaffleContract';
import { useTicketContract } from '@/hooks/contracts/useTicketContract';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useNotification } from '@/hooks/useNotification';
import { TICKET_BALANCE_REQUEST } from '@/hooks/useTicketsBalance';
import { parseRaffleFormat } from '@/utils/formatters/raffle';

import { useRaffleRoundAdditionalData } from './useRaffleRoundAdditionalData';

export const RAFFLE_ROUND_REQUEST = 'raffle-round-request';
export const RAFFLE_ROUND_USER_TICKETS_REQUEST = 'raffle-round-user-tickets-request';
const ENTRY_RAFFLE_MUTATION = 'entry-raffle-mutation';

export const useRaffleRoundById = (id?: number) => {
  const { address } = useAccount();
  const raffleContract = useRaffleContract();
  const ticketContract = useTicketContract();
  const queryClient = useQueryClient();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const { raffleRoundDataMap, isRafflesDataLoading } = useRaffleRoundAdditionalData();

  const enabled = id !== undefined;

  const fetchRoundRequest = useQuery({
    queryKey: [RAFFLE_ROUND_REQUEST, { id }],
    queryFn: () => raffleContract.getRound(id as number),
    enabled,
  });

  const userRoundEntryRequest = useQuery({
    queryKey: [RAFFLE_ROUND_USER_TICKETS_REQUEST, { id, address }],
    queryFn: () => raffleContract.getUserRoundEntry(address, id),
    enabled: enabled && Boolean(address),
    select: (data) => data?.toNumber(),
  });

  const round = useMemo(() => {
    if (fetchRoundRequest.data && raffleRoundDataMap) {
      return parseRaffleFormat(fetchRoundRequest.data, raffleRoundDataMap);
    }
    return undefined;
  }, [fetchRoundRequest.data, raffleRoundDataMap]);

  const entryRaffle = useMutation(
    [ENTRY_RAFFLE_MUTATION],
    async ({ roundId, tickets }: { roundId: number; tickets: BigNumberish }) => {
      if (!address) {
        connect();
        return;
      }
      const isApproved = await ticketContract.isApprovedForAll(address, raffleContract.address);
      if (!isApproved) {
        const approveTx = await ticketContract.setApprovalForAll(raffleContract.address, true);
        success({ title: 'Approved', txHash: approveTx });
      }

      const txHash = await raffleContract.entryRaffle(roundId, tickets);
      success({
        title: 'Success',
        description: `You have entered ${tickets} Tickets in ${
          round?.title || 'Ultra Raffle ' + roundId + 1
        }`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TICKET_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [RAFFLE_ROUND_USER_TICKETS_REQUEST] });
      },
      onError: (err) => {
        handleError(err, 'raffles');
      },
    }
  );

  return {
    isRoundLoading: fetchRoundRequest.isLoading || isRafflesDataLoading,
    fetchRoundRequest,
    round,
    userRoundEntryRequest,
    entryRaffle,
  };
};
