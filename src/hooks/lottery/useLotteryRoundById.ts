import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumberish } from 'ethers';
import { useAccount } from 'wagmi';

import { useLotteryContract } from '@/hooks/contracts/useLotteryContract';
import { useTicketContract } from '@/hooks/contracts/useTicketContract';
import { TICKET_BALANCE_REQUEST } from '@/hooks/lottery/useLottery';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useNotification } from '@/hooks/useNotification';
import { parseLotteryFormat } from '@/utils/formatters/lottery';

import { useLotteryRoundAdditionalData } from './useLotteryRoundAdditionalData';

export const LOTTERY_ROUND_REQUEST = 'lottery-round-request';
export const LOTTERY_ROUND_USER_TICKETS_REQUEST = 'lottery-round-user-tickets-request';
const ENTRY_LOTTERY_MUTATION = 'entry-lottery-mutation';

export const useLotteryRoundById = (id?: number) => {
  const { address } = useAccount();
  const lotteryContract = useLotteryContract();
  const ticketContract = useTicketContract();
  const queryClient = useQueryClient();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const { raffleRoundDataMap, isRafflesDataLoading } = useLotteryRoundAdditionalData();

  const enabled = id !== undefined;

  const fetchRoundRequest = useQuery({
    queryKey: [LOTTERY_ROUND_REQUEST, { id }],
    queryFn: () => lotteryContract.getRound(id as number),
    enabled,
  });

  const userRoundEntryRequest = useQuery({
    queryKey: [LOTTERY_ROUND_USER_TICKETS_REQUEST, { id, address }],
    queryFn: () => lotteryContract.getUserRoundEntry(address, id),
    enabled: enabled && Boolean(address),
    select: (data) => data?.toNumber(),
  });

  const round = useMemo(() => {
    if (fetchRoundRequest.data && raffleRoundDataMap) {
      return parseLotteryFormat(fetchRoundRequest.data, raffleRoundDataMap);
    }
    return undefined;
  }, [fetchRoundRequest.data, raffleRoundDataMap]);

  const entryLottery = useMutation(
    [ENTRY_LOTTERY_MUTATION],
    async ({ roundId, tickets }: { roundId: number; tickets: BigNumberish }) => {
      if (!address) {
        connect();
        return;
      }
      const isApproved = await ticketContract.isApprovedForAll(address, lotteryContract.address);
      if (!isApproved) {
        const approveTx = await ticketContract.setApprovalForAll(lotteryContract.address, true);
        success({ title: 'Approved', txHash: approveTx });
      }

      const txHash = await lotteryContract.entryLottery(roundId, tickets);
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
        queryClient.invalidateQueries({ queryKey: [LOTTERY_ROUND_USER_TICKETS_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    fetchRoundRequest,
    round,
    isRafflesDataLoading,
    userRoundEntryRequest,
    entryLottery,
  };
};
