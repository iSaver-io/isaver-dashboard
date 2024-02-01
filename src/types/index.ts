import { BigNumber } from 'ethers';

import { IStaking } from '@/types.common';

export * from './typechain-types';

export type RawStakingPlan = {};

export type RawStake = IStaking.StakeStructOutput & {
  stakingPlanId: number;
  stakeId: number;
};

export enum StakeStatusEnumType {
  Claimed = 'claimed',
  Completed = 'completed',
  InProgress = 'in progress',
}

export type Stake = {
  amount: BigNumber;
  timeStart: number;
  timeEnd: number;
  profit: BigNumber;
  reward: BigNumber;
  isClaimed: boolean;
  isSavrToken: boolean;
  stakingPlanId: number;
  stakeId: number;
  period: number;
  status: StakeStatusEnumType;
};

export type RawReferral = {
  referralAddress: string;
  level: BigNumber;
  activationDate: BigNumber;
  savTokenBalance: BigNumber;
  savrTokenBalance: BigNumber;
  isStakingSubscriptionActive: boolean;
  isReferralSubscriptionActive: boolean;
  isTeamSubscriptionActive: boolean;
};

export type Referral = {
  level: number;
  referralAddress: string;
  activationDate: number;
  savBalance: BigNumber;
  savrBalance: BigNumber;
  isStakingSubscriptionActive: boolean;
  isReferralSubscriptionActive: boolean;
  isTeamSubscriptionActive: boolean;
  isLevelSubscriptionActive: boolean;
};

export type ReferralReward = {
  referral: string;
  level: number;
  depositAmount: BigNumber;
  rewardAmount: BigNumber;
  depositDate: number;
  stakingDuration: number;
  reason: string;
};

export type StakingPlan = {
  durationDays: number;
  apr: number;
  subscriptionCost: BigNumber; // BigNumber
  subscriptionDurationDays: number;
};

export type TeamPlan = {
  subscriptionCost: BigNumber;
  reward: BigNumber;
  stakingThreshold: BigNumber;
  TeamSize: number;
  stakingPlanId: number;
};

export type HistoryEvent = {
  transactionHash: string;
  label: string;
  timestamp: number;
};
