import { BigNumber } from 'ethers';

import { RaffleAdditionalData } from '@/hooks/raffle/useRaffleRoundAdditionalData';
import { Helper, IRaffles } from '@/types.common';

import { getRaffleTitle } from '../raffle';

export enum RaffleStatusEnum {
  upcoming = 'upcoming',
  current = 'live',
  soldOut = 'sold out',
  closed = 'closed',
  past = 'past',
}

type RaffleRoundOverload = {
  id: number;
  title: string;
  description?: string;
  startTime: number;
  duration: number;
  maxTicketsFromOneMember: number;
  totalTickets: number;
  winnersForLevel: number[];
  prizeForLevel: number[];
  status: RaffleStatusEnum;
};

export type RaffleRoundType = Omit<IRaffles.RoundStructOutput, keyof RaffleRoundOverload> &
  RaffleRoundOverload;

export const parseRaffleFormat = (
  round: IRaffles.RoundStructOutput,
  raffleDataMap: RaffleAdditionalData
): RaffleRoundType => {
  const startTime = BigNumber.from(round.startTime).toNumber();
  const duration = BigNumber.from(round.duration).toNumber();
  const id = BigNumber.from(round.id).toNumber();

  return {
    ...round,
    id,
    title: raffleDataMap[id] ? `${raffleDataMap[id].title} ${id + 1}` : getRaffleTitle(id + 1),
    description: raffleDataMap[id] ? raffleDataMap[id].description : undefined,
    startTime,
    duration,
    maxTicketsFromOneMember: BigNumber.from(round.maxTicketsFromOneMember).toNumber(),
    totalTickets: BigNumber.from(round.totalTickets).toNumber(),
    winnersForLevel: round.winnersForLevel.map((winner) => BigNumber.from(winner).toNumber()),
    prizeForLevel: round.prizeForLevel.map((prize) => BigNumber.from(prize).toNumber()),
    status: getRaffleStatus({ startTime, duration, isFinished: round.isFinished }),
  };
};

export const getRaffleStatus = ({
  startTime,
  duration,
  isFinished,
}: {
  startTime: number;
  duration: number;
  isFinished: boolean;
}) => {
  const currentTime = Date.now() / 1000;
  if (isFinished) return RaffleStatusEnum.past;
  if (currentTime < startTime) return RaffleStatusEnum.upcoming;
  if (currentTime < startTime + duration) return RaffleStatusEnum.current;
  return RaffleStatusEnum.soldOut;
};

export const getNextRaffleTimestamp = ({
  status,
  startTime,
  duration,
}: Pick<RaffleRoundType, 'status' | 'startTime' | 'duration'>) => {
  return status === RaffleStatusEnum.current ? startTime + duration : startTime;
};

export type RaffleWinners = {
  level: number;
  address: string;
  tickets: number;
  prize: BigNumber;
};
export const calculateRaffleWinnersPrize = (
  winners: Helper.RafflesWinnersWithTicketsStructOutput[],
  round?: RaffleRoundType
): RaffleWinners[] => {
  if (!round) return [];

  return winners.map((winner) => ({
    level: winner.level.toNumber(),
    address: winner.winnerAddress,
    tickets: winner.enteredTickets.toNumber(),
    prize: getWinnerPrize(
      winner.level.toNumber(),
      round.winnersForLevel,
      round.prizeForLevel,
      round.totalPrize
    ),
  }));
};

const getWinnerPrize = (
  level: number,
  winnersForLevel: number[],
  prizeForLevel: number[],
  totalPrize: BigNumber
) => {
  const levelPrize = totalPrize.mul(prizeForLevel[level]).div(100);
  const winnerPrize = levelPrize.div(winnersForLevel[level]);

  return winnerPrize;
};
