import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { useTeamsContract } from '@/hooks/contracts/useTeamsContract';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useStakingPlans } from '@/hooks/staking/useStaking';
import { HELPER_USER_TEAMS_INFO_REQUEST, useHelperUserTeamsFullInfo } from '@/hooks/useHelper';
import { useNotification } from '@/hooks/useNotification';
import { SAV_BALANCE_REQUEST } from '@/hooks/useTokenBalance';
import { useTokens } from '@/hooks/useTokens';
import { bigNumberToString } from '@/utils/number';

export const SQUAD_PLANS_REQUEST = 'team-plans-info';
const SUBSCRIBE_TO_TEAMS_PLAN_MUTATION = 'subscribe-to-teams';

export const TEAMS_SUBSCRIPTION_ENDING_NOTIFICATION = 30 * 24 * 60 * 60; // 30 days in seconds

export const useTeamPlans = () => {
  const teamsContract = useTeamsContract();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  const teamPlansRequest = useQuery([SQUAD_PLANS_REQUEST], async () => {
    return await teamsContract.getPlans();
  });

  const updatePlanActivity = useMutation(
    ['update-team-plan-activity'],
    async ({ planId, isActive }: { planId: number; isActive: boolean }) => {
      const txHash = await teamsContract.updatePlanActivity(planId, isActive);
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

  const addTeamPlan = useMutation(
    ['add-team-plan'],
    async (params: {
      subscriptionCost: BigNumber;
      reward: BigNumber;
      stakingThreshold: BigNumber;
      teamSize: number;
      stakingPlanId: number;
    }) => {
      const txHash = await teamsContract.addPlan(params);
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
    teamPlansRequest,
    updatePlanActivity,
    addTeamPlan,
  };
};

export const useTeams = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const teamsContract = useTeamsContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();
  const { stakingPlansRequest } = useStakingPlans();
  const { userTeamsInfo } = useHelperUserTeamsFullInfo(account);
  const { teamPlansRequest } = useTeamPlans();

  const subscriptionPeriodDays = 365;

  const hasEndingTeamsSubscription = useMemo(
    () => (userTeamsInfo || []).some(({ isSubscriptionEnding }) => isSubscriptionEnding),
    [userTeamsInfo]
  );

  const subscribe = useMutation(
    [SUBSCRIBE_TO_TEAMS_PLAN_MUTATION],
    async (planId: number) => {
      const teamPlan = teamPlansRequest?.data?.find(
        (plan) => plan.teamPlanId.toNumber() === planId
      );
      if (!teamPlan) {
        return;
      }
      const stakingPlan = stakingPlansRequest?.data?.find(
        (plan) => plan.stakingPlanId === teamPlan.stakingPlanId.toNumber()
      );
      if (!stakingPlan) {
        return;
      }

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: teamsContract.address,
        requiredAmount: teamPlan.subscriptionCost,
      });

      const txHash = await teamsContract.subscribe(planId);
      success({
        title: 'Success',
        description: `${bigNumberToString(teamPlan.stakingThreshold, {
          precision: 0,
        })}/${stakingPlan.stakingDuration} Team subscription has been activated for one year`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [HELPER_USER_TEAMS_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    teamsContract,
    subscribe,
    subscriptionPeriodDays,
    hasEndingTeamsSubscription,
  };
};
