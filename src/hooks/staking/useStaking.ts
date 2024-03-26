import { useMemo } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, BigNumberish } from 'ethers';
import { useAccount } from 'wagmi';

import { useStakingContract } from '@/hooks/contracts/useStakingContract';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useUserPowers } from '@/hooks/useAvatarSettings';
import { HELPER_USER_TEAMS_INFO_REQUEST } from '@/hooks/useHelper';
import { useNotification } from '@/hooks/useNotification';
import { SAV_BALANCE_REQUEST, SAVR_BALANCE_REQUEST } from '@/hooks/useTokenBalance';
import { useTokens } from '@/hooks/useTokens';
import { RawStake } from '@/types';
import { formatStakes } from '@/utils/formatters/formatStakes';
import { bigNumberToString } from '@/utils/number';
import { getReadableDuration } from '@/utils/time';

const STAKING_PLANS_REQUEST = 'staking-plans';
const USER_STAKING_INFO_REQUEST = 'user-staking-info';
const USER_STAKES_REQUEST = 'user-stakes';
const STAKING_AVAILABLE_TOKENS_REQUEST = 'staking-available-tokens-request';
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

export const STAKING_EXTRA_APR_REQUEST = 'staking-extra-apr-request';
export const useStakingSuperPowers = () => {
  const stakingContract = useStakingContract();

  const statusPowerB = useUserPowers(1); // power B
  const statusPowerC = useUserPowers(2); // power C

  const extraAprRequest = useQuery([STAKING_EXTRA_APR_REQUEST], async () => {
    return await stakingContract.getExtraAprPowerC();
  });

  const extraAprPowerC = useMemo(
    () => (extraAprRequest.data?.toNumber() || 0) / 10,
    [extraAprRequest.data]
  );

  return {
    statusPowerB,
    statusPowerC,
    extraAprRequest,
    extraAprPowerC,
  };
};

export const USER_SUPER_STAKING_INFO_REQUEST = 'staking-super-user-stakes-request';
export const STAKING_DEPOSIT_SUPER_PLAN_MUTATION = 'staking-deposit-super-mutation';
export const STAKING_CLAIM_SUPER_PLAN_MUTATION = 'staking-claim-super-mutation';
export const STAKING_WITHDRAW_SUPER_PLAN_MUTATION = 'staking-withdraw-super-mutation';
export const useStakingSuperPlans = () => {
  const stakingContract = useStakingContract();
  const tokens = useTokens();
  const queryClient = useQueryClient();
  const { address: account } = useAccount();
  const { success, handleError } = useNotification();

  const superStakingPlansWithUserStakeRequest = useQuery(
    [USER_SUPER_STAKING_INFO_REQUEST, { account }],
    async () => (account ? stakingContract.getSuperStakingPlansWithStake(account) : null),
    {
      refetchInterval: 5000, // 5 sec
      select: (data) =>
        data
          ? data.map((superPlan) => ({
              ...superPlan,
              apr: { ...superPlan.apr, apr: superPlan.apr.apr.toNumber() / 10 },
              stakingPlanId: superPlan.plan.stakingPlanId.toNumber(),
            }))
          : [],
    }
  );

  const superStakingPlansWithUserStake = useMemo(
    () => superStakingPlansWithUserStakeRequest.data || [],
    [superStakingPlansWithUserStakeRequest.data]
  );

  const depositSuperPlan = useMutation(
    [STAKING_DEPOSIT_SUPER_PLAN_MUTATION],
    async ({ superPlanId, amount }: { superPlanId: number; amount: BigNumberish }) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAVR,
        spender: stakingContract.address,
        requiredAmount: amount,
      });

      const superStakingPlan = superStakingPlansWithUserStake.find(
        (superPlan) => superPlan.stakingPlanId === superPlanId
      );

      if (!superStakingPlan) throw new Error('Staking plan not found');

      const txHash = await stakingContract.depositSuperPlan({ superPlanId, amount });
      success({
        title: 'Success',
        description: `You have deposited ${bigNumberToString(amount)} SAVR in Staking pool with ${
          superStakingPlan.apr.apr
        }% APY`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_SUPER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAVR_BALANCE_REQUEST] });
      },
      onError: (err) => handleError(err, 'staking'),
    }
  );

  const claimSuperPlan = useMutation(
    [STAKING_WITHDRAW_SUPER_PLAN_MUTATION],
    async ({ superPlanId }: { superPlanId: number }) => {
      const txHash = await stakingContract.claimSuperPLan(superPlanId);

      const superStakingPlan = superStakingPlansWithUserStake.find(
        (superPlan) => superPlan.stakingPlanId === superPlanId
      );

      success({
        title: 'Success',
        description: `You have claimed ${bigNumberToString(
          superStakingPlan?.stake.profit || 0
        )} SAVR rewards`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_SUPER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAVR_BALANCE_REQUEST] });
      },
      onError: (err) => handleError(err, 'staking'),
    }
  );

  const withdrawSuperPlan = useMutation(
    [STAKING_CLAIM_SUPER_PLAN_MUTATION],
    async ({ superPlanId }: { superPlanId: number }) => {
      const txHash = await stakingContract.withdrawSuperPLan(superPlanId);

      const superStakingPlan = superStakingPlansWithUserStake.find(
        (superPlan) => superPlan.stakingPlanId === superPlanId
      );

      success({
        title: 'Success',
        description: `You have claimed ${bigNumberToString(
          superStakingPlan?.stake.profit || 0
        )} SAVR rewards and ${bigNumberToString(
          superStakingPlan?.stake.deposit || 0
        )} SAVR deposit`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_SUPER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAVR_BALANCE_REQUEST] });
      },
      onError: (err) => handleError(err, 'staking'),
    }
  );

  return {
    superStakingPlansWithUserStakeRequest,
    superStakingPlansWithUserStake,
    depositSuperPlan,
    claimSuperPlan,
    withdrawSuperPlan,
  };
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
  const { statusPowerB } = useStakingSuperPowers();

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
                    if (!stake.isSAVRToken) {
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
              plan.isActive ||
              plan.currentSavTokenStaked?.gt(0) ||
              plan.currentSavrTokenStaked?.gt(0)
          )
          .filter((plan) => (plan.isSuperPowered && statusPowerB.isActive) || !plan.isSuperPowered)
      : [];
  }, [stakingPlansRequest.data, userPlansInfoRequest.data, userStakesRequest, statusPowerB]);

  return {
    activeStakingPlansWithUserInfo,
  };
};

export const useStakingMetrics = () => {
  const { stakingPlansRequest } = useStakingPlans();
  const { superStakingPlansWithUserStake } = useStakingSuperPlans();

  const tvlSav = useMemo(() => {
    return stakingPlansRequest.data?.reduce(
      (acc, plan) => acc.add(plan.currentSavTokenLocked),
      BigNumber.from(0)
    );
  }, [stakingPlansRequest.data]);

  const tvlSavr = useMemo(() => {
    return stakingPlansRequest.data?.reduce(
      (acc, plan) => acc.add(plan.currentSavrTokenLocked),
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

  const superPlansMetrics = useMemo(() => {
    return superStakingPlansWithUserStake.reduce(
      (acc, superPlan) => {
        acc.tvl = acc.tvl.add(superPlan.plan.currentLocked);
        acc.totalClaimed = acc.totalClaimed.add(superPlan.plan.totalClaimed);
        acc.totalStaked = acc.totalStaked.add(superPlan.plan.totalStaked);
        return acc;
      },
      {
        tvl: BigNumber.from(0),
        totalClaimed: BigNumber.from(0),
        totalStaked: BigNumber.from(0),
      }
    );
  }, [superStakingPlansWithUserStake]);

  return {
    tvlSav,
    tvlSavr,
    tvlSavSavr,
    totalClaimed,
    superPlansMetrics,
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
      onError: (err) => handleError(err, 'staking'),
    }
  );

  const deposit = useMutation(
    [STAKING_DEPOSIT_MUTATION],
    async ({
      planId,
      amount,
      isSAVRToken,
      referrer,
    }: {
      planId: number;
      amount: BigNumberish;
      isSAVRToken: boolean;
      referrer?: string;
    }) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: isSAVRToken ? TOKENS.SAVR : TOKENS.SAV,
        spender: stakingContract.address,
        requiredAmount: amount,
      });

      const stakingPlan = activeStakingPlansWithUserInfo.find(
        (plan) => plan.stakingPlanId === planId
      );
      if (!stakingPlan) throw new Error('Staking plan not found');

      const txHash = await stakingContract.deposit({ planId, amount, isSAVRToken, referrer });
      success({
        title: 'Success',
        description: `You have deposited ${bigNumberToString(amount)} ${
          isSAVRToken ? 'SAVR' : 'SAV'
        } in ${getReadableDuration(stakingPlan.stakingDuration)} Staking pool`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [STAKING_PLANS_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKES_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [HELPER_USER_TEAMS_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAVR_BALANCE_REQUEST] });
      },
      onError: (err) => handleError(err, 'staking'),
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
        description: getWithdrawMessage(stake?.isSAVRToken ? 0 : stake?.amount, stake?.profit),
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
      onError: (err) => handleError(err, 'staking'),
    }
  );

  const withdrawAllCompleted = useMutation(
    [STAKING_CLAIM_ALL_MUTATION],
    async (planId: number) => {
      const txHash = await stakingContract.withdrawAllCompleted(planId);
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
      onError: (err) => handleError(err, 'staking'),
    }
  );

  return {
    subscribe,
    deposit,
    withdraw,
    withdrawAllCompleted,
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
      onError: (err) => handleError(err, 'staking'),
    }
  );

  const addStakingPlan = useMutation(
    ['add-staking-plan'],
    async ({
      subscriptionCost,
      stakingDuration,
      apr,
      isSuperPowered,
    }: {
      subscriptionCost: BigNumber;
      stakingDuration: number;
      apr: number;
      isSuperPowered: boolean;
    }) => {
      const subscriptionDuration = 365;
      const txHash = await stakingContract.addStakingPlan(
        subscriptionCost,
        subscriptionDuration,
        stakingDuration,
        apr,
        isSuperPowered
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
      onError: (err) => handleError(err, 'staking'),
    }
  );

  const addSuperStakingPlan = useMutation(
    ['add-super-staking-plan'],
    async ({ apr }: { apr: number }) => {
      const txHash = await stakingContract.addSuperStakingPlan(apr);
      success({
        title: 'Success',
        description: `${apr} APY super Staking plan created`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([USER_SUPER_STAKING_INFO_REQUEST]);
      },
      onError: (err) => handleError(err, 'staking'),
    }
  );

  const updateSuperPlanActivity = useMutation(
    ['update-super-plan-activity'],
    async ({ superPlanId, isActive }: { superPlanId: number; isActive: boolean }) => {
      const txHash = await stakingContract.updateSuperPlanActivity(superPlanId, isActive);
      success({
        title: 'Success',
        description: `${superPlanId} super staking plan ${isActive ? 'enabled' : 'disabled'}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([USER_SUPER_STAKING_INFO_REQUEST]);
      },
      onError: (err) => handleError(err, 'staking'),
    }
  );

  const updateExtraAprPowerC = useMutation(
    ['update-extra-apr-power-c'],
    async ({ apr }: { apr: number }) => {
      const txHash = await stakingContract.updateExtraAprPowerC(apr);
      success({
        title: 'Success',
        description: `Extra APR for Power C set to ${apr}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([USER_SUPER_STAKING_INFO_REQUEST]);
      },
      onError: (err) => handleError(err, 'staking'),
    }
  );

  return {
    updatePlanActivity,
    addStakingPlan,
    updateSuperPlanActivity,
    addSuperStakingPlan,
    updateExtraAprPowerC,
  };
};

export const useStakingAvailableTokens = (isSAVRToken: boolean) => {
  const stakingContract = useStakingContract();
  return useQuery([STAKING_AVAILABLE_TOKENS_REQUEST, { isSAVRToken }], () =>
    stakingContract.getAvailableTokens(isSAVRToken)
  );
};
