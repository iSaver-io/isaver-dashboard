import { BigNumber } from 'ethers';

import { RawStake, Stake, StakeStatusEnumType } from '@/types';

import { calculateStakeReward } from '../staking';

const getStakeStatus = (stake: RawStake): StakeStatusEnumType => {
  if (stake.isClaimed) return StakeStatusEnumType.Claimed;
  const currentTime = Date.now() / 1000;
  if (stake.timeEnd.toNumber() - currentTime < 0) return StakeStatusEnumType.Completed;
  return StakeStatusEnumType.InProgress;
};

export const formatStakes = (
  stakes: RawStake[],
  stakingPlans: { stakingDuration: BigNumber }[]
): Stake[] => {
  const getStakingDuration = (stakingPlanId: number) =>
    stakingPlans[stakingPlanId]?.stakingDuration.toNumber() || 0;

  return stakes.map((stake) => ({
    amount: stake.amount,
    timeStart: stake.timeStart.toNumber(),
    timeEnd: stake.timeEnd.toNumber(),
    profit: stake.profit,
    reward: calculateStakeReward(stake),
    isClaimed: stake.isClaimed,
    isSavrToken: stake.isSAVRToken,
    stakingPlanId: stake.stakingPlanId,
    stakeId: stake.stakeId,
    period: getStakingDuration(stake.stakingPlanId),
    status: getStakeStatus(stake),
  }));
};
