import { BigNumber, BigNumberish } from 'ethers';

import { makeBigNumber } from './number';

export const calculateStakeReward = (stake: {
  isSAVRToken: boolean;
  profit: BigNumber;
  amount: BigNumber;
}) => {
  return stake.isSAVRToken ? stake.profit : stake.profit.add(stake.amount);
};

export const calculateStakeRewardByAPR = (stake: {
  isSAVRToken: boolean;
  amount: BigNumberish;
  apr: BigNumberish;
  periodDays: BigNumberish;
}) => {
  const amountBN = makeBigNumber(stake.amount);
  const profit = amountBN.mul(stake.apr).div(100).div(365).mul(stake.periodDays);
  return calculateStakeReward({ profit, amount: amountBN, isSAVRToken: stake.isSAVRToken });
};

export const calculateStakeProfitByAPR = (stake: {
  amount: number;
  apr: number;
  periodDays: number;
}) => {
  // Outdated: Repeat the same logic as in contract (Staking -> calculateStakeProfit). For the same precision reason
  // const profit = amountBN.mul(stake.apr).div(365).mul(stake.periodDays).div(100);

  // const amountBN = makeBigNumber(stake.amount);
  // Not the same logic as in contract, better precision
  // const profit = amountBN.mul(stake.apr).mul(stake.periodDays).div(365).div(100);
  const profit = Math.round((stake.amount * stake.apr * stake.periodDays * 100) / 365) / 10000;

  return profit;
};
