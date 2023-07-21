import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useLotteryContract } from '@/hooks/contracts/useLotteryContract';
import { useNotification } from '@/hooks/useNotification';

import { TICKET_BALANCE_REQUEST } from './useLottery';

const LOTTERY_CLAIM_PERIOD_REQUEST = 'lottery-claim-period-request';
const LOTTERY_IS_CLAIMED_TODAY_REQUEST = 'lottery-is-claimed-today-request';
const LOTTERY_GET_LAST_CLAIM_REQUEST = 'lottery-get-last-claim-request';
const LOTTERY_CLAIM_STREAK_REQUEST = 'lottery-claim-streak-request';
const LOTTERY_IS_MINT_AVAILABLE_REQUEST = 'lottery-is-mint-available-request';
const CLAIM_DAY_MUTATION = 'claim-day-mutation';
const MINT_TICKET_MUTATION = 'mint-ticket-mutation';

const claimStreakForTicket = 5;
export const useLotteryMiniGame = () => {
  const { address: account } = useAccount();
  const queryClient = useQueryClient();
  const lotteryContract = useLotteryContract();
  const { success, handleError } = useNotification();

  const claimPeriod = useQuery(
    [LOTTERY_CLAIM_PERIOD_REQUEST],
    () => lotteryContract.getClaimPeriod(),
    { select: (data) => data.toNumber() }
  );

  const isClaimAvailable = useQuery(
    [LOTTERY_IS_CLAIMED_TODAY_REQUEST, { account }],
    () => lotteryContract.isClaimAvailable(account),
    { enabled: Boolean(account) }
  );

  const claimStreak = useQuery(
    [LOTTERY_CLAIM_STREAK_REQUEST, { account }],
    () => lotteryContract.getClaimStreak(account),
    {
      enabled: Boolean(account),
      select: (data) => data.toNumber(),
    }
  );

  const lastClaim = useQuery(
    [LOTTERY_GET_LAST_CLAIM_REQUEST, { account }],
    () => lotteryContract.getLastClaimTime(account),
    {
      enabled: Boolean(account),
      select: (data) => data.toNumber(),
    }
  );

  const isMintAvailable = useQuery(
    [LOTTERY_IS_MINT_AVAILABLE_REQUEST, { account }],
    () => lotteryContract.isMintAvailable(account),
    { enabled: Boolean(account) }
  );

  const claimDay = useMutation(
    [CLAIM_DAY_MUTATION],
    async () => {
      const txHash = await lotteryContract.claimDay();
      success({ title: 'Success', description: 'You have claimed for today', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [LOTTERY_IS_CLAIMED_TODAY_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_CLAIM_STREAK_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_GET_LAST_CLAIM_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_IS_MINT_AVAILABLE_REQUEST] });
      },
      onError: handleError,
    }
  );

  const mintMyTicket = useMutation(
    [MINT_TICKET_MUTATION],
    async () => {
      const txHash = await lotteryContract.mintMyTicket();
      success({ title: 'Success', description: 'You have minted Raffle Ticket', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TICKET_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_IS_CLAIMED_TODAY_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_CLAIM_STREAK_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_GET_LAST_CLAIM_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_IS_MINT_AVAILABLE_REQUEST] });
      },
      onError: handleError,
    }
  );

  return {
    claimStreakForTicket,
    claimPeriod,
    isClaimAvailable,
    claimStreak,
    lastClaim,
    isMintAvailable,

    claimDay,
    mintMyTicket,
  };
};
