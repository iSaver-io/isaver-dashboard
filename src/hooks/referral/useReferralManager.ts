import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { useAccount } from 'wagmi';

import { useReferralContract } from '@/hooks/contracts/useReferralContract';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useStakingPlans } from '@/hooks/staking/useStaking';
import { useUserPowers } from '@/hooks/useAvatarSettings';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useNotification } from '@/hooks/useNotification';
import { SAV_BALANCE_REQUEST, SAVR_BALANCE_REQUEST } from '@/hooks/useTokenBalance';
import { useTokens } from '@/hooks/useTokens';
import { formatReferralRewards } from '@/utils/formatters/formatReferralRewards';
import { bigNumberToString } from '@/utils/number';
import { createReferralLink } from '@/utils/referralLinks';

export const USER_REFERRAL_INFO_REQUEST = 'user-referrals-info';

export const LEVEL_SUBSCRIPTION_COST_REQUEST = 'get-referral-level-subscription-cost';
export const ALL_LEVELS_SUBSCRIPTION_COST_REQUEST = 'get-all-referral-levels-subscription-cost';
const USER_REFERRAL_REWARDS_REQUEST = 'user-referral-rewards';
const SUBSCRIBE_TO_REFERRAL_LEVEL_MUTATION = 'subscribe-to-referral-level';
const SUBSCRIBE_TO_ALL_REFERRAL_LEVELS_MUTATION = 'subscribe-to-all-referral-levels';
const SET_MY_REFERRER_MUTATION = 'set-my-referrer';
const CLAIM_REFERRAL_REWARDS_MUTATION = 'claim-referral-rewards';

export const REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION = 30 * 24 * 60 * 60; // 30 days in seconds

export const LEVELS = 10;
export const REFERRAL_SUBSCRIPTION_DURATION = 365;

export const useReferralManagerSubscriptions = () => {
  const referralContract = useReferralContract();
  const queryClient = useQueryClient();
  const { success, handleError } = useNotification();

  const levelSubscriptionCost = useQuery([LEVEL_SUBSCRIPTION_COST_REQUEST], async () => {
    return await referralContract.contract.levelSubscriptionCost();
  });
  const fullSubscriptionCost = useQuery([ALL_LEVELS_SUBSCRIPTION_COST_REQUEST], async () => {
    return await referralContract.contract.fullSubscriptionCost();
  });

  const updateLevelSubscription = useMutation(
    ['update-level-subscription-cost'],
    async (cost: number) => {
      const costBN = parseEther(cost.toString());

      const txHash = await referralContract.updateLevelSubscriptionCost(costBN);
      success({ title: 'Success', description: '1 level subscription cost updated', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LEVEL_SUBSCRIPTION_COST_REQUEST]);
        queryClient.invalidateQueries([ALL_LEVELS_SUBSCRIPTION_COST_REQUEST]);
      },
      onError: handleError,
    }
  );

  const updateFullSubscription = useMutation(
    ['update-full-subscription-cost'],
    async (cost: number) => {
      const costBN = parseEther(cost.toString());

      const txHash = await referralContract.updateFullSubscriptionCost(costBN);
      success({ title: 'Success', description: 'Full subscription cost updated', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LEVEL_SUBSCRIPTION_COST_REQUEST]);
        queryClient.invalidateQueries([ALL_LEVELS_SUBSCRIPTION_COST_REQUEST]);
      },
      onError: handleError,
    }
  );

  return {
    levelSubscriptionCost,
    fullSubscriptionCost,
    updateLevelSubscription,
    updateFullSubscription,
    referralContract,
  };
};

export const useUserReferralInfo = () => {
  const { address: account } = useAccount();
  const referralContract = useReferralContract();

  const userReferralInfoRequest = useQuery([USER_REFERRAL_INFO_REQUEST, { account }], async () => {
    return account ? await referralContract.getUserInfo(account) : null;
  });

  const hasEndingReferralSubscription = useMemo(() => {
    const currentTime = Date.now() / 1000;
    return (userReferralInfoRequest.data?.activeLevels || []).some(
      (till: any) =>
        till &&
        till.toNumber() - currentTime > 0 &&
        till.toNumber() - currentTime < REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION
    );
  }, [userReferralInfoRequest.data]);

  return { userReferralInfoRequest, hasEndingReferralSubscription };
};

export const REFERRAL_HAS_ACTIVE_POWER_A = 'has-active-power-a';
export const REFERRAL_HAS_ACTIVATED_POWER_A = 'has-activated-power-a';
export const REFERRAL_HAS_FULL_SUBSCRIPTION = 'has-full-subscription';
export const useUserReferralSubscription = () => {
  const { address: account } = useAccount();
  const { levelSubscriptionCost, fullSubscriptionCost } = useReferralManagerSubscriptions();
  const queryClient = useQueryClient();
  const referralContract = useReferralContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();
  const { userReferralInfoRequest } = useUserReferralInfo();

  const levelsSubscription = useMemo(
    () =>
      (userReferralInfoRequest.data?.activeLevels || Array.from({ length: 10 })).map((till) =>
        BigNumber.from(till || 0).toNumber()
      ),
    [userReferralInfoRequest.data]
  );

  const fullSubscription = useMemo(
    () =>
      levelsSubscription.some((till) => till !== levelsSubscription[0]) ? 0 : levelsSubscription[0],
    [levelsSubscription]
  );

  const hasActivePowerA = useQuery([REFERRAL_HAS_ACTIVE_POWER_A, { account }], async () =>
    account ? referralContract.userHasActivePowerA(account) : false
  );

  const hasActivatedPowerA = useQuery([REFERRAL_HAS_ACTIVATED_POWER_A, { account }], async () =>
    account ? referralContract.userHasActivatedPowerA(account) : false
  );

  const statusPowerA = useUserPowers(0);

  const subscribeToLevel = useMutation(
    [SUBSCRIBE_TO_REFERRAL_LEVEL_MUTATION],
    async (level: number) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: referralContract.address,
        requiredAmount: levelSubscriptionCost.data || BigNumber.from(10).pow(18), // fallback to 10 tokens
      });

      const txHash = await referralContract.subscribeToLevel(level);
      success({
        title: 'Success',
        description: `Level ${level} of Referral subscription has been activated for one year`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [REFERRAL_HAS_ACTIVE_POWER_A] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const subscribeToAllLevels = useMutation(
    [SUBSCRIBE_TO_ALL_REFERRAL_LEVELS_MUTATION],
    async () => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: referralContract.address,
        requiredAmount: fullSubscriptionCost.data || BigNumber.from(10).pow(18), // fallback to 10 tokens
      });

      const txHash = await referralContract.subscribeToAllLevels();
      success({
        title: 'Success',
        description: 'All Levels of Referral subscription have been activated for one year',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [REFERRAL_HAS_ACTIVE_POWER_A] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    levelsSubscription,
    fullSubscription,
    subscribeToLevel,
    subscribeToAllLevels,

    hasActivePowerA,
    hasActivatedPowerA,
    statusPowerA,
  };
};

export const useUserReferrer = () => {
  const { address: account } = useAccount();
  const queryClient = useQueryClient();
  const { connect } = useConnectWallet();
  const referralContract = useReferralContract();
  const { userReferralInfoRequest } = useUserReferralInfo();
  const { levelsSubscription } = useUserReferralSubscription();
  const { success, handleError } = useNotification();

  const referrer = useMemo(
    () =>
      userReferralInfoRequest.data?.referrer &&
      userReferralInfoRequest.data.referrer !== ethers.constants.AddressZero
        ? userReferralInfoRequest.data.referrer
        : undefined,
    [userReferralInfoRequest.data]
  );

  const referralLink = useMemo(
    () =>
      account && levelsSubscription[0] > Date.now() / 1000
        ? createReferralLink(account)
        : undefined,
    [levelsSubscription, account]
  );

  const setMyReferrer = useMutation(
    [SET_MY_REFERRER_MUTATION],
    async (referrer: string) => {
      if (!account) {
        connect();
        return;
      }
      const txHash = await referralContract.setMyReferrer(referrer);
      success({ title: 'Success', description: `Your leader is ${referrer}`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return { referrer, referralLink, setMyReferrer };
};

export const useReferralRewards = () => {
  const { address: account } = useAccount();
  const queryClient = useQueryClient();
  const referralContract = useReferralContract();
  const { stakingPlansRequest } = useStakingPlans();
  const { success, handleError } = useNotification();
  const { connect } = useConnectWallet();

  const referralRewardsRequest = useQuery(
    [USER_REFERRAL_REWARDS_REQUEST, { account }],
    async () => {
      return account ? await referralContract.getRewards(account) : null;
    }
  );

  const referralRewards = useMemo(() => {
    if (referralRewardsRequest.data && stakingPlansRequest.data) {
      return formatReferralRewards(referralRewardsRequest.data, stakingPlansRequest.data);
    }
    return [];
  }, [referralRewardsRequest.data, stakingPlansRequest.data]);

  const claimDividends = useMutation(
    [CLAIM_REFERRAL_REWARDS_MUTATION],
    async (rewards: BigNumber) => {
      if (!account) {
        connect();
        return;
      }

      const txHash = await referralContract.claimRewards(rewards);
      success({
        title: 'Success',
        description: `${bigNumberToString(rewards)} SAVR Referral Rewards have been claimed`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAVR_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return { referralRewardsRequest, referralRewards, claimDividends };
};
