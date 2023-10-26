import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { useStakingContract } from '@/hooks/contracts/useStakingContract';
import { useStakingPlans } from '@/hooks/staking/useStaking';
import { bigNumberToNumber } from '@/utils/number';
import { getDayFromDate, ONE_DAY } from '@/utils/time';

type StakeLockChange = {
  day: number;
  change: BigNumber;
  isSAVRToken: boolean;
};
type StakeLockBalance = {
  day: number;
  balance: BigNumber;
  changeSAVToken: BigNumber;
  changeSAVRToken: BigNumber;
};
type TotalClaimedHistory = {
  day: number;
  totalClaimed: BigNumber;
};
type TvlHistory = {
  day: number;
  tvl: BigNumber;
};
type AggregatedTvlAndClaimedHistory = {
  day: number;
  tvl: BigNumber;
  totalClaimed: BigNumber;
};

export const useStakingHistory = (enabled: boolean = true) => {
  const { getAllStakes, getAllClaims } = useStakingContract();
  const { stakingPlansRequest } = useStakingPlans();

  const stakesDataRequest = useQuery(['stakes-history-request'], getAllStakes, {
    enabled,
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
    enabled,
    select: (data) =>
      data.map(({ args }) => {
        const timestamp = args.timestamp.toNumber();
        return {
          ...args,
          timestamp,
        };
      }),
  });

  const claimsCountData = useMemo(
    () =>
      claimsDataRequest?.data?.reduce((acc, claim) => {
        const id = claim.stakingPlanId.toNumber();
        const isSAVRToken = claim.isSAVRToken;

        if (!acc[id]) {
          acc[id] = { sav: 0, savr: 0 };
        }

        if (isSAVRToken) {
          acc[id].savr += 1;
        } else {
          acc[id].sav += 1;
        }

        return acc;
      }, {} as Record<number, { sav: number; savr: number }>),
    [claimsDataRequest.data]
  );

  return { stakesDataRequest, claimsDataRequest, claimsCountData };
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
          change: stake.isSAVRToken ? stake.profit : stake.amount.add(stake.profit),
          isSAVRToken: stake.isSAVRToken,
        });
        acc.push({
          day: tillDay,
          change: stake.isSAVRToken ? stake.profit.mul(-1) : stake.amount.add(stake.profit).mul(-1),
          isSAVRToken: false,
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
            changeSAVToken: !tx.isSAVRToken ? tx.change : BigNumber.from(0),
            changeSAVRToken: tx.isSAVRToken ? tx.change : BigNumber.from(0),
          });
        } else {
          const prev = acc.slice(-1)[0];
          if (prev.day === tx.day) {
            acc[acc.length - 1].balance = prev.balance.add(tx.change);
            acc[acc.length - 1].changeSAVToken = !tx.isSAVRToken
              ? prev.changeSAVToken.add(tx.change)
              : prev.changeSAVToken;
            acc[acc.length - 1].changeSAVRToken = tx.isSAVRToken
              ? prev.changeSAVRToken.add(tx.change)
              : prev.changeSAVRToken;
          } else {
            acc.push({
              day: tx.day,
              balance: prev.balance.add(tx.change),
              changeSAVToken: !tx.isSAVRToken ? tx.change : BigNumber.from(0),
              changeSAVRToken: tx.isSAVRToken ? tx.change : BigNumber.from(0),
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
        changeSAVToken: bigNumberToNumber(data.changeSAVToken),
        changeSAVRToken: bigNumberToNumber(data.changeSAVRToken),
      }));
  }, [stakesDataRequest.data, groupPeriod, minDate, maxDate]);

  return stakingUnlocksData;
};

export const useStakingTvlAndTotalClaimed = () => {
  const { isConnected } = useAccount();
  // Fetch only for disconnected
  const { stakesDataRequest, claimsDataRequest } = useStakingHistory(!isConnected);

  const stakingClaimsHistory = useMemo<TotalClaimedHistory[]>(
    () =>
      aggregateHistoryByDay(claimsDataRequest.data || []).map(({ aggregatedAmount, ...data }) => ({
        ...data,
        totalClaimed: aggregatedAmount,
      })),
    [claimsDataRequest.data]
  );

  const stakesHistory = useMemo<TvlHistory[]>(
    () =>
      aggregateHistoryByDay(stakesDataRequest.data || []).map(({ aggregatedAmount, ...data }) => ({
        ...data,
        tvl: aggregatedAmount,
      })),
    [stakesDataRequest.data]
  );

  const aggregatedTvlAndClaimedData = useMemo(
    () =>
      [...stakesHistory, ...stakingClaimsHistory]
        .sort((a, b) => a.day - b.day)
        .reduce((acc, item) => {
          const lastItem = acc.length
            ? acc[acc.length - 1]
            : ({
                day: 0,
                tvl: BigNumber.from(0),
                totalClaimed: BigNumber.from(0),
              } as AggregatedTvlAndClaimedHistory);

          if (Object.hasOwn(item, 'tvl')) {
            acc.push({
              day: item.day,
              tvl: lastItem.tvl.add((item as TvlHistory).tvl),
              totalClaimed: lastItem.totalClaimed,
            });
          } else {
            // subtract claimed amount from new or the same day
            if (lastItem.day === item.day) {
              acc[acc.length - 1].tvl = acc[acc.length - 1].tvl.sub(
                (item as TotalClaimedHistory).totalClaimed
              );
              acc[acc.length - 1].totalClaimed = acc[acc.length - 1].totalClaimed.add(
                (item as TotalClaimedHistory).totalClaimed
              );
            } else {
              acc.push({
                day: item.day,
                tvl: lastItem.tvl.sub((item as TotalClaimedHistory).totalClaimed),
                totalClaimed: lastItem.totalClaimed.add((item as TotalClaimedHistory).totalClaimed),
              });
            }
          }

          return acc;
        }, [] as AggregatedTvlAndClaimedHistory[])
        .map((item) => ({
          ...item,
          tvl: bigNumberToNumber(item.tvl),
          totalClaimed: bigNumberToNumber(item.totalClaimed),
        })),
    [stakesHistory, stakingClaimsHistory]
  );

  return {
    stakesHistory,
    stakingClaimsHistory,
    tvlAndClaimedData: aggregatedTvlAndClaimedData,
  };
};

type HistoryData = {
  timestamp: number;
  amount: BigNumber;
};
type AggregatedHistoryData = {
  day: number;
  aggregatedAmount: BigNumber;
};
const aggregateHistoryByDay = (data: HistoryData[]) => {
  return data.reduce((acc, item) => {
    const date = new Date(item.timestamp * 1000);
    const day = getDayFromDate(date);

    const lastItem = acc.length
      ? acc[acc.length - 1]
      : ({ day: 0, aggregatedAmount: BigNumber.from(0) } as AggregatedHistoryData);

    if (day === lastItem.day) {
      acc[acc.length - 1].aggregatedAmount = acc[acc.length - 1].aggregatedAmount.add(item.amount);
    } else {
      acc.push({
        day,
        aggregatedAmount: item.amount,
      });
    }

    return acc;
  }, [] as AggregatedHistoryData[]);
};
