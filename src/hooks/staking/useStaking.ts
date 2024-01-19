import { useMemo } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, BigNumberish } from 'ethers';
import { useAccount } from 'wagmi';

import { useStakingContract } from '@/hooks/contracts/useStakingContract';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { HELPER_USER_SQUADS_INFO_REQUEST } from '@/hooks/useHelper';
import { useNotification } from '@/hooks/useNotification';
import { SAV_BALANCE_REQUEST, SAVR_BALANCE_REQUEST } from '@/hooks/useTokenBalance';
import { useTokens } from '@/hooks/useTokens';
import { RawStake } from '@/types';
import { formatStakes } from '@/utils/formatters/formatStakes';
import { bigNumberToString } from '@/utils/number';
import { getReadableDuration } from '@/utils/time';

export const STAKING_PLANS_REQUEST = 'staking-plans';
export const USER_STAKING_INFO_REQUEST = 'user-staking-info';
export const USER_STAKES_REQUEST = 'user-stakes';
const STAKING_SUBSCRIBE_MUTATION = 'staking-subscribe';
const STAKING_DEPOSIT_MUTATION = 'staking-deposit';
const STAKING_CLAIM_MUTATION = 'staking-claim';
const STAKING_CLAIM_ALL_MUTATION = 'staking-claim-all';

const STAKING_SUBSCRIPTION_ENDING_NOTIFICATION = 30 * 24 * 60 * 60; // 30 days in seconds

const getWithdrawMessage = (deposit?: BigNumberish, rewards?: BigNumberish) => {
  let message = '';
  if (deposit && BigNumber.from(deposit).gt(0)) {
    message = `${bigNumberToString(deposit)} SAV Deposit and `;
  }
  message += `${bigNumberToString(rewards || 0)} SAV Rewards have been claimed`;
  return message;
};

export const useStakingPlans = () => {
  const stakingContract = useStakingContract();

  const stakingPlansRequest = useQuery(
    [STAKING_PLANS_REQUEST],
    async () => {
      return await stakingContract.getStakingPlans();
    },
    {
      select: (data) =>
        data.map((plan) => ({
          ...plan,
          apr: plan.apr.toNumber() / 10,
          stakingPlanId: plan.stakingPlanId.toNumber(),
        })),
    }
  );

  const activeStakingPlans = useMemo(
    () => (stakingPlansRequest.data || []).filter((plan) => plan.isActive),
    [stakingPlansRequest.data]
  );

  return { stakingPlansRequest, activeStakingPlans };
};

export const useStakingUserStakes = () => {
  const { address: account } = useAccount();
  const stakingContract = useStakingContract();
  const { activeStakingPlans, stakingPlansRequest } = useStakingPlans();

  const userStakesRequest = useQueries({
    queries: activeStakingPlans.map((plan) => ({
      queryKey: [USER_STAKES_REQUEST, { account, id: plan.stakingPlanId }],
      queryFn: async () =>
        account
          ? stakingContract
              .getUserStakes(account, plan.stakingPlanId)
              .then((stakes) =>
                stakes.map(
                  (stake, index) =>
                    ({ ...stake, stakeId: index, stakingPlanId: plan.stakingPlanId } as RawStake)
                )
              )
          : null,
    })),
  });

  const userStakes = useMemo(() => {
    const stakes = userStakesRequest.reduce((acc, stakes) => {
      if (!stakes.data || !stakes.data.length) return acc;
      acc.push(...stakes.data);
      return acc;
    }, [] as RawStake[]);

    if (stakingPlansRequest.data) {
      return formatStakes(stakes, stakingPlansRequest.data);
    }
    return [];
  }, [stakingPlansRequest.data, userStakesRequest]);

  return {
    userStakesRequest,
    userStakes,
  };
};

const isSubscriptionFinishing = (subscribedTill: BigNumber) => {
  const currentTime = Date.now() / 1000;
  const endTime = subscribedTill?.toNumber() || 0;
  return (
    endTime - currentTime < STAKING_SUBSCRIPTION_ENDING_NOTIFICATION && endTime - currentTime > 0
  );
};

export const useStakingPlansUserInfo = () => {
  const { address: account } = useAccount();
  const stakingContract = useStakingContract();

  const userPlansInfoRequest = useQuery([USER_STAKING_INFO_REQUEST, { account }], async () => {
    const res = account ? await stakingContract.getUserStakingInfo(account) : null;
    return res;
  });

  const hasEndingSubscription = useMemo(
    () =>
      userPlansInfoRequest.data?.some(
        ({ subscribedTill, isSubscribed }) =>
          isSubscribed && subscribedTill && isSubscriptionFinishing(subscribedTill)
      ),
    [userPlansInfoRequest.data]
  );

  return { userPlansInfoRequest, hasEndingSubscription };
};

export const useActiveStakingPlansWithUserInfo = () => {
  const { stakingPlansRequest } = useStakingPlans();
  const { userStakesRequest } = useStakingUserStakes();
  const { userPlansInfoRequest } = useStakingPlansUserInfo();

  const activeStakingPlansWithUserInfo = useMemo(() => {
    return stakingPlansRequest.data
      ? stakingPlansRequest.data
          .map((plan, index) => {
            const { subscribedTill, isSubscribed } = userPlansInfoRequest.data?.[index] || {};

            const currentTime = Date.now() / 1000;
            const isSubscriptionEnding =
              isSubscribed && subscribedTill && isSubscriptionFinishing(subscribedTill);

            const stakes = userStakesRequest.find(
              (s) => s.data?.[0]?.stakingPlanId === plan.stakingPlanId
            )?.data;

            const { totalReward, totalDeposit, totalAvailableReward } = stakes
              ? stakes.reduce(
                  (acc, stake) => {
                    if (stake.isClaimed) {
                      return acc;
                    }
                    if (!stake.isToken2) {
                      acc.totalDeposit = acc.totalDeposit.add(stake.amount);
                    }
                    acc.totalReward = acc.totalReward.add(stake.profit);

                    if (stake.timeEnd.toNumber() < Date.now() / 1000) {
                      acc.totalAvailableReward = stake.profit;
                    }

                    return acc;
                  },
                  {
                    totalReward: BigNumber.from(0),
                    totalAvailableReward: BigNumber.from(0),
                    totalDeposit: BigNumber.from(0),
                  }
                )
              : {
                  totalReward: undefined,
                  totalDeposit: undefined,
                  totalAvailableReward: undefined,
                };

            const hasReadyStakes = stakes?.some(
              (stake) => stake.timeEnd.toNumber() <= currentTime && !stake.isClaimed
            );

            return {
              ...plan,
              ...userPlansInfoRequest.data?.[index],
              isSubscriptionEnding,
              totalReward,
              totalAvailableReward,
              totalDeposit,
              stakes,
              hasReadyStakes,
            };
          })
          .filter(
            (plan) =>
              plan.isActive || plan.currentToken1Staked?.gt(0) || plan.currentToken2Staked?.gt(0)
          )
      : [];
  }, [stakingPlansRequest.data, userPlansInfoRequest.data, userStakesRequest]);

  return {
    activeStakingPlansWithUserInfo,
  };
};

export const useStakingMetrics = () => {
  const { stakingPlansRequest } = useStakingPlans();

  const tvlSav = useMemo(() => {
    return stakingPlansRequest.data?.reduce(
      (acc, plan) => acc.add(plan.currentToken1Locked),
      BigNumber.from(0)
    );
  }, [stakingPlansRequest.data]);

  const tvlSavr = useMemo(() => {
    return stakingPlansRequest.data?.reduce(
      (acc, plan) => acc.add(plan.currentToken2Locked),
      BigNumber.from(0)
    );
  }, [stakingPlansRequest.data]);

  const tvlSavSavr = useMemo(() => {
    return tvlSav?.add(tvlSavr || 0);
  }, [tvlSav, tvlSavr]);

  const totalClaimed = useMemo(() => {
    return stakingPlansRequest.data?.reduce(
      (acc, plan) => acc.add(plan.totalClaimed),
      BigNumber.from(0)
    );
  }, [stakingPlansRequest.data]);

  return {
    tvlSav,
    tvlSavr,
    tvlSavSavr,
    totalClaimed,
  };
};

export const useStakingActions = () => {
  const queryClient = useQueryClient();
  const stakingContract = useStakingContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();
  const { activeStakingPlansWithUserInfo } = useActiveStakingPlansWithUserInfo();

  const subscribe = useMutation(
    [STAKING_SUBSCRIBE_MUTATION],
    async (planId: number) => {
      const stakingPlan = activeStakingPlansWithUserInfo.find(
        (plan) => plan.stakingPlanId === planId
      );
      if (!stakingPlan) throw new Error('Staking plan not found');

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: stakingContract.address,
        requiredAmount: stakingPlan.subscriptionCost,
      });
      const txHash = await stakingContract.subscribe(planId);
      success({
        title: 'Success',
        description: `${getReadableDuration(
          stakingPlan.stakingDuration
        )} Staking subscription has been activated for one year`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const deposit = useMutation(
    [STAKING_DEPOSIT_MUTATION],
    async ({
      planId,
      amount,
      isToken2,
      referrer,
    }: {
      planId: number;
      amount: BigNumberish;
      isToken2: boolean;
      referrer?: string;
    }) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: isToken2 ? TOKENS.SAVR : TOKENS.SAV,
        spender: stakingContract.address,
        requiredAmount: amount,
      });

      const stakingPlan = activeStakingPlansWithUserInfo.find(
        (plan) => plan.stakingPlanId === planId
      );
      if (!stakingPlan) throw new Error('Staking plan not found');

      const txHash = await stakingContract.deposit({ planId, amount, isToken2, referrer });
      success({
        title: 'Success',
        description: `You have deposited ${bigNumberToString(amount)} ${
          isToken2 ? 'SAVR' : 'SAV'
        } in ${getReadableDuration(stakingPlan.stakingDuration)} Staking pool`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [STAKING_PLANS_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKES_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [HELPER_USER_SQUADS_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAVR_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const withdraw = useMutation(
    [STAKING_CLAIM_MUTATION],
    async ({ planId, stakeId }: { planId: number; stakeId: number }) => {
      const txHash = await stakingContract.withdraw(planId, stakeId);
      const stake = activeStakingPlansWithUserInfo.find((plan) => plan.stakingPlanId === planId)
        ?.stakes?.[stakeId];
      success({
        title: 'Success',
        description: getWithdrawMessage(stake?.isToken2 ? 0 : stake?.amount, stake?.profit),
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [STAKING_PLANS_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKES_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const withdrawAll = useMutation(
    [STAKING_CLAIM_ALL_MUTATION],
    async (planId: number) => {
      const txHash = await stakingContract.withdrawAll(planId);
      const stakingPlan = activeStakingPlansWithUserInfo.find(
        (plan) => plan.stakingPlanId === planId
      );
      success({
        title: 'Success',
        description: getWithdrawMessage(
          stakingPlan?.totalDeposit,
          stakingPlan?.totalAvailableReward
        ),
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [STAKING_PLANS_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKES_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    subscribe,
    deposit,
    withdraw,
    withdrawAll,
    stakingContract,
  };
};

export const useStakingAdminActions = () => {
  const queryClient = useQueryClient();
  const stakingContract = useStakingContract();
  const { success, handleError } = useNotification();

  const updatePlanActivity = useMutation(
    ['update-plan-activity'],
    async ({ planId, isActive }: { planId: number; isActive: boolean }) => {
      const txHash = await stakingContract.updatePlanActivity(planId, isActive);
      success({
        title: 'Success',
        description: `${planId} staking plan ${isActive ? 'enabled' : 'disabled'}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([STAKING_PLANS_REQUEST]);
      },
      onError: handleError,
    }
  );

  const addStakingPlan = useMutation(
    ['add-staking-plan'],
    async ({
      subscriptionCost,
      stakingDuration,
      apr,
    }: {
      subscriptionCost: BigNumber;
      stakingDuration: number;
      apr: number;
    }) => {
      const subscriptionDuration = 365;
      const txHash = await stakingContract.addStakingPlan(
        subscriptionCost,
        subscriptionDuration,
        stakingDuration,
        apr
      );
      success({
        title: 'Success',
        description: `${stakingDuration} days Staking plan created`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([STAKING_PLANS_REQUEST]);
      },
      onError: handleError,
    }
  );

  return { updatePlanActivity, addStakingPlan };
};
