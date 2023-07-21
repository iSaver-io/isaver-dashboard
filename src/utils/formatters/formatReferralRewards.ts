import { BigNumber } from 'ethers';

import { ReferralReward } from '@/types';
import { DividendsAddedEvent } from '@/types/typechain-types/contracts/ReferralManager';

const REASONS_MAP: Record<string, string> = {
  '0': 'complete',
  '1': 'no level',
  '2': 'no stake',
  '3': 'limited',
  '4': 'team',
};
const getRewardReason = (reason: BigNumber) => REASONS_MAP[reason.toString()] || '---';

export const formatReferralRewards = (
  rawRewards: DividendsAddedEvent[],
  stakingPlans: { stakingDuration: BigNumber }[]
): ReferralReward[] => {
  const getStakingDuration = (stakingPlanId: number) =>
    stakingPlans[stakingPlanId]?.stakingDuration.toNumber() || 0;

  return rawRewards.map(({ args }) => ({
    referral: args.referral,
    level: args.level.toNumber(),
    depositAmount: args.depositAmount,
    rewardAmount: args.rewardAmount,
    depositDate: args.timestamp.toNumber(),
    stakingDuration: getStakingDuration(args.stakingPlanId.toNumber()),
    reason: getRewardReason(args.reason),
  }));
};
