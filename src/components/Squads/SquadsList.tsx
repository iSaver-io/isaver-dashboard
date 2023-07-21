import { useCallback } from 'react';
import { Flex, Skeleton, useBreakpoint } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useSquadPlans, useSquads } from '@/hooks/squads/useSquads';
import { useStakingPlans } from '@/hooks/staking/useStaking';
import { useHelperUserSquadsFullInfo } from '@/hooks/useHelper';
import { useLogger } from '@/hooks/useLogger';
import { bigNumberToString } from '@/utils/number';

import { SquadItem } from './SquadItem';

export const SquadsList = ({ isPageView = false }: { isPageView?: boolean }) => {
  const { address } = useAccount();
  const { subscribe } = useSquads();
  const { userSquadsInfo } = useHelperUserSquadsFullInfo(address);
  const { squadPlansRequest } = useSquadPlans();
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
      const squadPlan = squadPlansRequest?.data?.find(
        (plan) => plan.squadPlanId.toNumber() === planId
      );
      if (squadPlan) {
        const stakingPlan = stakingPlansRequest?.data?.find(
          (plan) => plan.stakingPlanId === squadPlan.stakingPlanId.toNumber()
        );

        logger({
          event: isPageView ? 'team' : 'dashboard',
          value: bigNumberToString(squadPlan.subscriptionCost),
          content: stakingPlan?.subscriptionDuration.toString(),
        });
      }

      return subscribe.mutateAsync(planId);
    },
    [logger, subscribe, isPageView, squadPlansRequest, stakingPlansRequest]
  );

  return (
    <Flex
      justifyContent="center"
      gap={{ sm: '20px', md: '30px', lg: '10px', xl: '20px' }}
      flexWrap="wrap"
      marginX={{ lg: '-5px', base: 'unset' }}
    >
      {!userSquadsInfo.length
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

      {userSquadsInfo.map(
        ({
          squadStatus,
          members,
          plan,
          userHasSufficientStaking,
          stakingPlan,
          isSubscriptionEnding,
        }) => (
          <SquadItem
            key={plan.squadPlanId.toNumber()}
            isSmallSize={isSm}
            subscription={squadStatus.subscription}
            squadsFilled={squadStatus.squadsFilled}
            subscriptionCost={plan.subscriptionCost}
            squadSize={plan.squadSize}
            isSubscriptionEnding={isSubscriptionEnding}
            stakingDuration={stakingPlan?.stakingDuration || 0}
            userHasStake={userHasSufficientStaking}
            members={members}
            reward={plan.reward}
            onSubscribe={() => handleSubscribe(plan.squadPlanId.toNumber())}
          />
        )
      )}
    </Flex>
  );
};
