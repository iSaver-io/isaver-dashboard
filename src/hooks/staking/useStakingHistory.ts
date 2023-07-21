import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import { useStakingContract } from '@/hooks/contracts/useStakingContract';
import { useStakingPlans } from '@/hooks/staking/useStaking';
import { bigNumberToNumber } from '@/utils/number';
import { getDayFromDate, ONE_DAY } from '@/utils/time';

type StakeLockChange = {
  day: number;
  change: BigNumber;
  isToken2: boolean;
};
type StakeLockBalance = {
  day: number;
  balance: BigNumber;
  changeToken1: BigNumber;
  changeToken2: BigNumber;
};

export const useStakingHistory = () => {
  const { getAllStakes, getAllClaims } = useStakingContract();
  const { stakingPlansRequest } = useStakingPlans();

  const stakesDataRequest = useQuery(['stakes-history-request'], getAllStakes, {
    select: (data) =>
      data.map(({ args }) => {
        const stakingPlan = stakingPlansRequest.data?.find(
          (plan) => plan.stakingPlanId === args.stakingPlanId.toNumber()
        );
        const period = stakingPlan?.stakingDuration.toNumber() || 0;
        const timestamp = args.timestamp.toNumber();
        const tillTimestamp = timestamp + period * 86_400;

        return {
          ...args,
          stakingPlanId: args.stakingPlanId.toNumber(),
          period,
          timestamp,
          tillTimestamp,
        };
      }),
  });

  const claimsDataRequest = useQuery(['claims-history-request'], getAllClaims, {
    select: (data) =>
      data.reduce((acc, claim) => {
        const id = claim.args.stakingPlanId.toNumber();
        const isToken2 = claim.args.isToken2;

        if (!acc[id]) {
          acc[id] = { sav: 0, savr: 0 };
        }

        if (isToken2) {
          acc[id].savr += 1;
        } else {
          acc[id].sav += 1;
        }

        return acc;
      }, {} as Record<number, { sav: number; savr: number }>),
  });

  return { stakesDataRequest, claimsDataRequest };
};

export enum PERIOD {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export const useStakingUnlocks = (
  groupPeriod: PERIOD = PERIOD.DAY,
  minDate?: Date | null,
  maxDate?: Date | null
) => {
  const { stakesDataRequest } = useStakingHistory();

  const stakingUnlocksData = useMemo(() => {
    const balanceChange = stakesDataRequest.data?.reduce(
      (acc, stake) => {
        const date = new Date(stake.timestamp * 1000);
        const tillDate = new Date(stake.tillTimestamp * 1000);
        // period = day
        let day = getDayFromDate(date);
        let tillDay = getDayFromDate(tillDate);
        if (groupPeriod === PERIOD.WEEK) {
          // period = week
          const start = new Date(2023, 0, 2);
          const week = Math.floor((date.getTime() - start.getTime()) / ONE_DAY / 7);
          const tillWeek = Math.floor((tillDate.getTime() - start.getTime()) / ONE_DAY / 7);
          const weekDate = new Date(start.getTime() + week * 7 * ONE_DAY);
          const tillWeekDate = new Date(start.getTime() + tillWeek * 7 * ONE_DAY);

          day = getDayFromDate(weekDate);
          tillDay = getDayFromDate(tillWeekDate);
        } else if (groupPeriod === PERIOD.MONTH) {
          // period = month
          const monthDate = new Date(date.getFullYear(), date.getMonth());
          const tillMonthDate = new Date(tillDate.getFullYear(), tillDate.getMonth());
          day = getDayFromDate(monthDate);
          tillDay = getDayFromDate(tillMonthDate);
        }
        acc.push({
          day,
          change: stake.isToken2 ? stake.profit : stake.amount.add(stake.profit),
          isToken2: stake.isToken2,
        });
        acc.push({
          day: tillDay,
          change: stake.isToken2 ? stake.profit.mul(-1) : stake.amount.add(stake.profit).mul(-1),
          isToken2: false,
        });
        return acc;
      },
      [
        // { day: Math.floor(Date.now() / ONE_DAY) + 30, change: BigNumber.from(0) },
      ] as StakeLockChange[]
    );

    return balanceChange
      ?.sort((a, b) => a.day - b.day)
      .reduce((acc, tx) => {
        if (!acc.length) {
          acc.push({
            day: tx.day,
            balance: tx.change,
            changeToken1: !tx.isToken2 ? tx.change : BigNumber.from(0),
            changeToken2: tx.isToken2 ? tx.change : BigNumber.from(0),
          });
        } else {
          const prev = acc.slice(-1)[0];
          if (prev.day === tx.day) {
            acc[acc.length - 1].balance = prev.balance.add(tx.change);
            acc[acc.length - 1].changeToken1 = !tx.isToken2
              ? prev.changeToken1.add(tx.change)
              : prev.changeToken1;
            acc[acc.length - 1].changeToken2 = tx.isToken2
              ? prev.changeToken2.add(tx.change)
              : prev.changeToken2;
          } else {
            acc.push({
              day: tx.day,
              balance: prev.balance.add(tx.change),
              changeToken1: !tx.isToken2 ? tx.change : BigNumber.from(0),
              changeToken2: tx.isToken2 ? tx.change : BigNumber.from(0),
            });
          }
        }

        return acc;
      }, [] as StakeLockBalance[])
      .filter(
        (data) =>
          (minDate ? data.day >= minDate.getTime() / ONE_DAY + 1 : true) &&
          (maxDate ? data.day <= maxDate.getTime() / ONE_DAY + 1 : true)
      )
      .map((data) => ({
        ...data,
        balance: bigNumberToNumber(data.balance),
        changeToken1: bigNumberToNumber(data.changeToken1),
        changeToken2: bigNumberToNumber(data.changeToken2),
      }));
  }, [stakesDataRequest.data, groupPeriod, minDate, maxDate]);

  return stakingUnlocksData;
};
