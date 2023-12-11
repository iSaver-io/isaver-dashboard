import { useCallback } from 'react';
import { Flex, Skeleton, useBreakpoint } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useStakingPlans } from '@/hooks/staking/useStaking';
import { useTeamPlans, useTeams } from '@/hooks/teams/useTeams';
import { useHelperUserTeamsFullInfo } from '@/hooks/useHelper';
import { useLogger } from '@/hooks/useLogger';
import { bigNumberToString } from '@/utils/number';

import { TeamItem } from './TeamItem';

export const TeamsList = ({ isPageView = false }: { isPageView?: boolean }) => {
  const { address } = useAccount();
  const { subscribe } = useTeams();
  const { userTeamsInfo } = useHelperUserTeamsFullInfo(address);
  const { teamPlansRequest } = useTeamPlans();
  const { stakingPlansRequest } = useStakingPlans();

  const logger = useLogger({
    category: 'elements',
    action: 'button_click',
    label: 'activate',
    context: 'teams',
    actionGroup: 'conversions',
  });

  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'lg', 'xl'].includes(bp);

  const handleSubscribe = useCallback(
    (planId: number) => {
      const teamPlan = teamPlansRequest?.data?.find(
        (plan) => plan.teamPlanId.toNumber() === planId
      );
      if (teamPlan) {
        const stakingPlan = stakingPlansRequest?.data?.find(
          (plan) => plan.stakingPlanId === teamPlan.stakingPlanId.toNumber()
        );

        logger({
          event: isPageView ? 'team' : 'dashboard',
          value: bigNumberToString(teamPlan.subscriptionCost),
          content: stakingPlan?.subscriptionDuration.toString(),
        });
      }

      return subscribe.mutateAsync(planId);
    },
    [logger, subscribe, isPageView, teamPlansRequest, stakingPlansRequest]
  );

  return (
    <Flex
      justifyContent="center"
      gap={{ sm: '20px', md: '30px', lg: '10px', xl: '20px' }}
      flexWrap="wrap"
      marginX={{ lg: '-5px', base: 'unset' }}
    >
      {!userTeamsInfo.length
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              width={isSm ? '300px' : '420px'}
              height={isSm ? '350px' : '490px'}
              borderRadius="md"
              startColor="gray.200"
              endColor="bgGreen.200"
            />
          ))
        : null}

      {userTeamsInfo.map(
        ({
          teamStatus,
          members,
          plan,
          userHasSufficientStaking,
          stakingPlan,
          isSubscriptionEnding,
        }) => (
          <TeamItem
            key={plan.teamPlanId.toNumber()}
            isSmallSize={isSm}
            subscription={teamStatus.subscription}
            teamsFilled={teamStatus.teamsFilled}
            subscriptionCost={plan.subscriptionCost}
            teamSize={plan.teamSize}
            isSubscriptionEnding={isSubscriptionEnding}
            stakingDuration={stakingPlan?.stakingDuration || 0}
            userHasStake={userHasSufficientStaking}
            members={members}
            reward={plan.reward}
            onSubscribe={() => handleSubscribe(plan.teamPlanId.toNumber())}
          />
        )
      )}
    </Flex>
  );
};
