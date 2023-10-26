import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';

import { useHelperContract } from '@/hooks/contracts/useHelperContract';
import { useRaffleRoundById } from '@/hooks/raffle/useRaffleRoundById';
import { useUserReferralInfo } from '@/hooks/referral/useReferralManager';
import { useStakingPlans } from '@/hooks/staking/useStaking';
import { TEAMS_SUBSCRIPTION_ENDING_NOTIFICATION } from '@/hooks/teams/useTeams';
import { RawReferral } from '@/types';
import { formatReferrals } from '@/utils/formatters/formatReferrals';
import { calculateRaffleWinnersPrize } from '@/utils/formatters/raffle';

export const HELPER_REFERRALS_LIST_REQUEST = 'helper-referrals-list';
export const useHelperReferralsFullInfoByLevel = (account?: string, levels?: number[]) => {
  const helperContract = useHelperContract();
  const { userReferralInfoRequest } = useUserReferralInfo();

  const referralsQueries = useQueries({
    queries: (levels || [])?.map((level) => ({
      queryKey: [HELPER_REFERRALS_LIST_REQUEST, account, level],
      queryFn: async () => {
        return account && level
          ? await helperContract.getReferralsFullInfoByLevel(account, level)
          : null;
      },
    })),
  });

  const referralsFullInfoList = useMemo(() => {
    const referrals = referralsQueries.reduce((acc, { data }) => {
      if (data) {
        acc.push(...data);
      }
      return acc;
    }, [] as RawReferral[]);

    return formatReferrals(referrals, userReferralInfoRequest.data?.activeLevels || []);
  }, [referralsQueries, userReferralInfoRequest.data]);

  return referralsFullInfoList;
};

export const HELPER_USER_TEAMS_INFO_REQUEST = 'helper-user-teams-info';
export const useHelperUserTeamsFullInfo = (account?: string) => {
  const helperContract = useHelperContract();
  const { stakingPlansRequest } = useStakingPlans();

  const userTeamsInfoRequest = useQuery([HELPER_USER_TEAMS_INFO_REQUEST, { account }], async () =>
    helperContract.getUserTeamsInfo(account || ethers.constants.AddressZero)
  );

  const userTeamsInfo = useMemo(() => {
    const currentTime = Date.now() / 1000;
    return (
      userTeamsInfoRequest.data
        ?.filter(({ plan }) => plan.isActive)
        .map(({ plan, teamStatus, members, userHasSufficientStaking }) => ({
          plan: { ...plan },
          teamStatus: { ...teamStatus },
          members,
          userHasSufficientStaking,
          stakingPlan: stakingPlansRequest.data?.[plan.stakingPlanId.toNumber()],
          isSubscriptionEnding:
            teamStatus.subscription.toNumber() > 0 &&
            teamStatus.subscription.toNumber() - currentTime > 0 &&
            teamStatus.subscription.toNumber() - currentTime <
              TEAMS_SUBSCRIPTION_ENDING_NOTIFICATION,
        })) || []
    );
  }, [stakingPlansRequest.data, userTeamsInfoRequest.data]);

  return {
    userTeamsInfoRequest,
    userTeamsInfo,
  };
};

export const HELPER_RAFFLE_ROUND_WINNERS_REQUEST = 'helper-raffle-round-winners';
export const useHelperRaffleRoundWinners = (roundId?: number) => {
  const helperContract = useHelperContract();
  const { round } = useRaffleRoundById(roundId);

  const roundWinnersRequest = useQuery(
    [HELPER_RAFFLE_ROUND_WINNERS_REQUEST],
    async () => helperContract.getRafflesRoundWinnersWithTickets(roundId),
    {
      enabled: roundId !== undefined && Boolean(round),
      select: (winners) => calculateRaffleWinnersPrize(winners, round),
    }
  );

  return roundWinnersRequest;
};
