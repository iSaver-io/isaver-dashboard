import { useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useLotteryContract } from '@/hooks/contracts/useLotteryContract';
import { ILottery } from '@/types.common';
import {
  LotteryRoundType,
  LotteryStatusEnum,
  parseLotteryFormat,
} from '@/utils/formatters/lottery';

import { useLotteryRoundAdditionalData } from './useLotteryRoundAdditionalData';

export const LOTTERY_ACTIVE_ROUNDS_REQUEST = 'lottery-active-rounds-request';
export const LOTTERY_LAST_FINISHED_ROUNDS_REQUEST = 'lottery-finished-rounds-request';

const FETCH_LIMIT = 6;
export const useLotteryRounds = () => {
  const lotteryContract = useLotteryContract();
  const { raffleRoundDataMap } = useLotteryRoundAdditionalData();

  const activeRoundsRequest = useQuery([LOTTERY_ACTIVE_ROUNDS_REQUEST], () =>
    lotteryContract.getActiveRounds()
  );

  const finishedRoundsRequest = useInfiniteQuery({
    queryKey: [LOTTERY_LAST_FINISHED_ROUNDS_REQUEST],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await lotteryContract.getLastFinishedRounds(
        FETCH_LIMIT,
        FETCH_LIMIT * pageParam
      );
      return {
        data,
        nextCursor: data.length < FETCH_LIMIT ? undefined : pageParam + 1,
      };
    },
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
  });

  const activeRounds = useMemo(() => {
    if (raffleRoundDataMap && activeRoundsRequest.data) {
      return activeRoundsRequest.data
        .map((round) => parseLotteryFormat(round, raffleRoundDataMap))
        .sort((a, b) => b.id - a.id);
    }
    return undefined;
  }, [raffleRoundDataMap, activeRoundsRequest.data]);

  const { upcomingRounds, liveRounds } = useMemo(() => {
    const rounds = (activeRounds || []).reduce(
      (acc, round) => {
        if (round.status === LotteryStatusEnum.upcoming) {
          acc.upcomingRounds.push(round);
        } else {
          acc.liveRounds.push(round);
        }
        return acc;
      },
      { liveRounds: [] as LotteryRoundType[], upcomingRounds: [] as LotteryRoundType[] }
    );

    const sortedLiveRounds = rounds.liveRounds.sort(
      (a, b) => a.startTime + a.duration - (b.startTime + b.duration)
    );
    const sortedUpcomingRounds = rounds.upcomingRounds.sort((a, b) => a.startTime - b.startTime);

    return { upcomingRounds: sortedUpcomingRounds, liveRounds: sortedLiveRounds };
  }, [activeRounds]);

  const finishedRounds = useMemo(() => {
    if (raffleRoundDataMap && finishedRoundsRequest.data) {
      return finishedRoundsRequest.data?.pages
        .reduce((acc, { data }) => {
          acc.push(...data);
          return acc;
        }, [] as ILottery.RoundStructOutput[])
        .map((data) => parseLotteryFormat(data, raffleRoundDataMap))
        .sort((a, b) => b.id - a.id);
    }
    return undefined;
  }, [finishedRoundsRequest.data, raffleRoundDataMap]);

  return {
    activeRoundsRequest,
    activeRounds,
    finishedRoundsRequest,
    upcomingRounds,
    liveRounds,
    finishedRounds,
  };
};
