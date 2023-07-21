import { BigNumber, BigNumberish } from 'ethers';

import { makeBigNumber } from './number';

export const calculateStakeReward = (stake: {
  isToken2: boolean;
  profit: BigNumber;
  amount: BigNumber;
}) => {
  return stake.isToken2 ? stake.profit : stake.profit.add(stake.amount);
};

export const calculateStakeRewardByAPR = (stake: {
  isToken2: boolean;
  amount: BigNumberish;
  apr: BigNumberish;
  periodDays: BigNumberish;
}) => {
  const amountBN = makeBigNumber(stake.amount);
  const profit = amountBN.mul(stake.apr).div(100).div(365).mul(stake.periodDays);
  return calculateStakeReward({ profit, amount: amountBN, isToken2: stake.isToken2 });
};

export const calculateStakeProfitByAPR = (stake: {
  amount: BigNumberish;
  apr: BigNumberish;
  periodDays: BigNumberish;
}) => {
  const amountBN = makeBigNumber(stake.amount);
  // Repeat the same logic as in contract (Staking -> calculateStakeProfit). For the same precision reason
  const profit = amountBN.mul(stake.apr).div(365).mul(stake.periodDays).div(100);
  return profit;
};
