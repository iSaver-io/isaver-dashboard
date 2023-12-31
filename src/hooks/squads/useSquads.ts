import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { useSquadsContract } from '@/hooks/contracts/useSquadsContract';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useStakingPlans } from '@/hooks/staking/useStaking';
import { HELPER_USER_SQUADS_INFO_REQUEST, useHelperUserSquadsFullInfo } from '@/hooks/useHelper';
import { useNotification } from '@/hooks/useNotification';
import { SAV_BALANCE_REQUEST } from '@/hooks/useTokenBalance';
import { useTokens } from '@/hooks/useTokens';
import { bigNumberToString } from '@/utils/number';

export const SQUAD_PLANS_REQUEST = 'squad-plans-info';
const SUBSCRIBE_TO_SQUADS_PLAN_MUTATION = 'subscribe-to-squads';

export const SQUADS_SUBSCRIPTION_ENDING_NOTIFICATION = 30 * 24 * 60 * 60; // 30 days in seconds

export const useSquadPlans = () => {
  const squadsContract = useSquadsContract();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  const squadPlansRequest = useQuery([SQUAD_PLANS_REQUEST], async () => {
    return await squadsContract.getPlans();
  });

  const updatePlanActivity = useMutation(
    ['update-squad-plan-activity'],
    async ({ planId, isActive }: { planId: number; isActive: boolean }) => {
      const txHash = await squadsContract.updatePlanActivity(planId, isActive);
      success({
        title: 'Success',
        description: `Team plan with id ${planId} - ${isActive ? 'enabled' : 'disabled'}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([SQUAD_PLANS_REQUEST]);
      },
      onError: handleError,
    }
  );

  const addSquadPlan = useMutation(
    ['add-squad-plan'],
    async (params: {
      subscriptionCost: BigNumber;
      reward: BigNumber;
      stakingThreshold: BigNumber;
      squadSize: number;
      stakingPlanId: number;
    }) => {
      const txHash = await squadsContract.addPlan(params);
      success({ title: 'Success', description: 'Team plan has been created', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([SQUAD_PLANS_REQUEST]);
      },
      onError: handleError,
    }
  );

  return {
    squadPlansRequest,
    updatePlanActivity,
    addSquadPlan,
  };
};

export const useSquads = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const squadsContract = useSquadsContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();
  const { stakingPlansRequest } = useStakingPlans();
  const { userSquadsInfo } = useHelperUserSquadsFullInfo(account);
  const { squadPlansRequest } = useSquadPlans();

  const subscriptionPeriodDays = 365;

  const hasEndingSquadsSubscription = useMemo(
    () => (userSquadsInfo || []).some(({ isSubscriptionEnding }) => isSubscriptionEnding),
    [userSquadsInfo]
  );

  const subscribe = useMutation(
    [SUBSCRIBE_TO_SQUADS_PLAN_MUTATION],
    async (planId: number) => {
      const squadPlan = squadPlansRequest?.data?.find(
        (plan) => plan.squadPlanId.toNumber() === planId
      );
      if (!squadPlan) {
        return;
      }
      const stakingPlan = stakingPlansRequest?.data?.find(
        (plan) => plan.stakingPlanId === squadPlan.stakingPlanId.toNumber()
      );
      if (!stakingPlan) {
        return;
      }

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: squadsContract.address,
        requiredAmount: squadPlan.subscriptionCost,
      });

      const txHash = await squadsContract.subscribe(planId);
      success({
        title: 'Success',
        description: `${bigNumberToString(squadPlan.stakingThreshold, {
          precision: 0,
        })}/${stakingPlan.stakingDuration} Team subscription has been activated for one year`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [HELPER_USER_SQUADS_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    squadsContract,
    subscribe,
    subscriptionPeriodDays,
    hasEndingSquadsSubscription,
  };
};
