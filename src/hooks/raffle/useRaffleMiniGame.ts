import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useRaffleContract } from '@/hooks/contracts/useRaffleContract';
import { useUserPowers } from '@/hooks/useAvatarSettings';
import { useNotification } from '@/hooks/useNotification';
import { TICKET_BALANCE_REQUEST } from '@/hooks/useTicketsBalance';

const RAFFLE_CLAIM_PERIOD_REQUEST = 'raffle-claim-period-request';
const RAFFLE_IS_CLAIMED_TODAY_REQUEST = 'raffle-is-claimed-today-request';
const RAFFLE_GET_LAST_CLAIM_REQUEST = 'raffle-get-last-claim-request';
const RAFFLE_CLAIM_STREAK_REQUEST = 'raffle-claim-streak-request';
const RAFFLE_IS_MINT_AVAILABLE_REQUEST = 'raffle-is-mint-available-request';
export const EXTRA_TICKETS_POWER_D_REQUEST = 'extra-tickets-power-d-request';
const CLAIM_DAY_MUTATION = 'claim-day-mutation';
const MINT_TICKET_MUTATION = 'mint-ticket-mutation';

const claimStreakForTicket = 5;
export const useRaffleMiniGame = () => {
  const { address: account } = useAccount();
  const queryClient = useQueryClient();
  const raffleContract = useRaffleContract();
  const { success, handleError } = useNotification();
  const { isActive: isPowerDActive } = useUserPowers(3); // power D

  const extraTicketsPowerD = useQuery(
    [EXTRA_TICKETS_POWER_D_REQUEST],
    () => raffleContract.extraTicketsPowerD(),
    { select: (data) => data.toNumber() }
  );

  const claimPeriod = useQuery(
    [RAFFLE_CLAIM_PERIOD_REQUEST],
    () => raffleContract.getClaimPeriod(),
    { select: (data) => data.toNumber() }
  );

  const isClaimAvailable = useQuery(
    [RAFFLE_IS_CLAIMED_TODAY_REQUEST, { account }],
    () => raffleContract.isClaimAvailable(account),
    { enabled: Boolean(account) }
  );

  const claimStreak = useQuery(
    [RAFFLE_CLAIM_STREAK_REQUEST, { account }],
    () => raffleContract.getClaimStreak(account),
    {
      enabled: Boolean(account),
      select: (data) => data.toNumber(),
    }
  );

  const lastClaim = useQuery(
    [RAFFLE_GET_LAST_CLAIM_REQUEST, { account }],
    () => raffleContract.getLastClaimTime(account),
    {
      enabled: Boolean(account),
      select: (data) => data.toNumber(),
    }
  );

  const isMintAvailable = useQuery(
    [RAFFLE_IS_MINT_AVAILABLE_REQUEST, { account }],
    () => raffleContract.isMintAvailable(account),
    { enabled: Boolean(account) }
  );

  const claimDay = useMutation(
    [CLAIM_DAY_MUTATION],
    async () => {
      const txHash = await raffleContract.claimDay();
      success({ title: 'Success', description: 'You have claimed for today', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [RAFFLE_IS_CLAIMED_TODAY_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [RAFFLE_CLAIM_STREAK_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [RAFFLE_GET_LAST_CLAIM_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [RAFFLE_IS_MINT_AVAILABLE_REQUEST] });
      },
      onError: (err) => handleError(err, 'raffles'),
    }
  );

  const mintMyTicket = useMutation(
    [MINT_TICKET_MUTATION],
    async () => {
      const amount = isPowerDActive && extraTicketsPowerD.data ? extraTicketsPowerD.data : null;

      const txHash = await raffleContract.mintMyTicket();
      success({
        title: 'Success',
        description: `You have minted ${amount ? amount + 'x ' : ''}Raffle Ticket`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TICKET_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [RAFFLE_IS_CLAIMED_TODAY_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [RAFFLE_CLAIM_STREAK_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [RAFFLE_GET_LAST_CLAIM_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [RAFFLE_IS_MINT_AVAILABLE_REQUEST] });
      },
      onError: (err) => handleError(err, 'raffles'),
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

    extraTicketsPowerD,
    isPowerDActive,
  };
};
