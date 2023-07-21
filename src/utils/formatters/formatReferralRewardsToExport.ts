import { ReferralReward } from '@/types';

import { bigNumberToNumber } from '../number';

export const formatReferralRewardsToExport = (rewards: ReferralReward[]) => {
  const headers = [
    'Level',
    'Referral address',
    'Deposit SAV',
    'Deposit date',
    'Staking period',
    'Reward SAVR',
    'Reason',
  ];
  const data = rewards.map((reward) => [
    reward.level,
    reward.referral,
    bigNumberToNumber(reward.depositAmount),
    new Date(reward.depositDate * 1000),
    reward.stakingDuration + 'days',
    bigNumberToNumber(reward.rewardAmount),
    reward.reason,
  ]);

  return { data, headers };
};
