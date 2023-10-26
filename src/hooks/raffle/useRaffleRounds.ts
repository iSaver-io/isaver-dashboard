import { useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useRaffleContract } from '@/hooks/contracts/useRaffleContract';
import { IRaffles } from '@/types.common';
import { parseRaffleFormat, RaffleRoundType, RaffleStatusEnum } from '@/utils/formatters/raffle';

import { useRaffleRoundAdditionalData } from './useRaffleRoundAdditionalData';

export const RAFFLE_ACTIVE_ROUNDS_REQUEST = 'raffle-active-rounds-request';
export const RAFFLE_LAST_FINISHED_ROUNDS_REQUEST = 'raffle-finished-rounds-request';

const FETCH_LIMIT = 6;
export const useRaffleRounds = () => {
  const raffleContract = useRaffleContract();
  const { raffleRoundDataMap } = useRaffleRoundAdditionalData();

  const activeRoundsRequest = useQuery([RAFFLE_ACTIVE_ROUNDS_REQUEST], () =>
    raffleContract.getActiveRounds()
  );

  const finishedRoundsRequest = useInfiniteQuery({
    queryKey: [RAFFLE_LAST_FINISHED_ROUNDS_REQUEST],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await raffleContract.getLastFinishedRounds(FETCH_LIMIT, FETCH_LIMIT * pageParam);
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
        .map((round) => parseRaffleFormat(round, raffleRoundDataMap))
        .sort((a, b) => b.id - a.id);
    }
    return undefined;
  }, [raffleRoundDataMap, activeRoundsRequest.data]);

  const { upcomingRounds, liveRounds } = useMemo(() => {
    const rounds = (activeRounds || []).reduce(
      (acc, round) => {
        if (round.status === RaffleStatusEnum.upcoming) {
          acc.upcomingRounds.push(round);
        } else {
          acc.liveRounds.push(round);
        }
        return acc;
      },
      { liveRounds: [] as RaffleRoundType[], upcomingRounds: [] as RaffleRoundType[] }
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
        }, [] as IRaffles.RoundStructOutput[])
        .map((data) => parseRaffleFormat(data, raffleRoundDataMap))
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
