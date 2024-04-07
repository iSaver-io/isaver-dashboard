import { BigNumber, BigNumberish } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { Raffles } from '@/types.common';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export type CreateRaffleProps = {
  startTime: number;
  duration: number;
  initialPrize: BigNumber;
  tokensForOneTicket: BigNumber;
  maxTicketsFromOneMember: number;
  winnersForLevel: number[];
  prizeForLevel: number[];
};

export const useRaffleContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Raffles,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as Raffles;

  const getWinnerTotalPrize = (address: string) => {
    return contract.getWinnerPrize(address);
  };

  const getTicketPrice = () => {
    return contract.TICKET_PRICE();
  };

  const getRounds = () => {
    return contract.getRounds();
  };

  const getRound = (roundId: number) => {
    return contract.getRound(roundId);
  };

  const getUserRoundEntry = (user?: string, roundId?: BigNumberish) => {
    return user && roundId !== undefined
      ? contract.getUserRoundEntry(user, roundId)
      : Promise.reject('incorrect request params');
  };

  const getActiveRounds = () => {
    return contract.getActiveRounds();
  };

  const getLastFinishedRounds = (length: number, offset: number) => {
    return contract.getLastFinishedRounds(length, offset);
  };

  const getClaimPeriod = () => {
    return contract.CLAIM_PERIOD();
  };

  const getTotalBurnedTickets = () => {
    return contract.totalBurnedTickets();
  };

  const isClaimAvailable = (user?: string) => {
    return user ? contract.isClaimAvailable(user) : Promise.reject('incorrect request data');
  };

  const getLastClaimTime = (user?: string) => {
    return user ? contract.getLastClaimTime(user) : Promise.reject('incorrect request data');
  };

  const getClaimStreak = (user?: string) => {
    return user ? contract.getClaimStreak(user) : Promise.reject('incorrect request data');
  };

  const isMintAvailable = (user?: string) => {
    return user ? contract.isMintAvailable(user) : Promise.reject('incorrect request data');
  };

  const entryRaffle = async (roundId: BigNumberish, tickets: BigNumberish) => {
    const tx = await contract.entryRaffle(roundId, tickets);
    return waitForTransaction(tx);
  };

  const buyTickets = async (amount: BigNumberish) => {
    const tx = await contract.buyTickets(amount);
    return waitForTransaction(tx);
  };

  const extraTicketsPowerD = async () => {
    return await contract.extraTicketsPowerD();
  };

  const claimDay = async () => {
    const tx = await contract.claimDay();
    return waitForTransaction(tx);
  };

  const mintMyTicket = async () => {
    const tx = await contract.mintMyTicket();
    return waitForTransaction(tx);
  };

  // Administration
  const updateTicketPrice = async (price: BigNumber) => {
    const tx = await contract.updateTicketPrice(price);
    return waitForTransaction(tx);
  };

  const updateExtraTicketsPowerD = async (amount: number) => {
    const tx = await contract.updateExtraTicketsPowerD(amount);
    return waitForTransaction(tx);
  };

  const finishRaffleRound = async (roundId: number) => {
    const tx = await contract.finishRaffleRound(roundId);
    return waitForTransaction(tx);
  };

  const getWinnersFromOracleRandom = async (roundId: number) => {
    const tx = await contract.getWinnersFromOracleRandom(roundId, { gasLimit: 15000000 });
    return waitForTransaction(tx);
  };

  const createRaffleRound = async ({
    startTime,
    duration,
    initialPrize,
    tokensForOneTicket,
    maxTicketsFromOneMember,
    winnersForLevel,
    prizeForLevel,
  }: CreateRaffleProps) => {
    const tx = await contract.createRaffleRound(
      startTime,
      duration,
      initialPrize,
      tokensForOneTicket,
      maxTicketsFromOneMember,
      winnersForLevel,
      prizeForLevel
    );
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    getTicketPrice,
    getWinnerTotalPrize,
    getRounds,
    getRound,
    getUserRoundEntry,
    getActiveRounds,
    getLastFinishedRounds,
    getTotalBurnedTickets,

    getClaimPeriod,
    getClaimStreak,
    isClaimAvailable,
    getLastClaimTime,
    isMintAvailable,

    extraTicketsPowerD,
    entryRaffle,
    buyTickets,
    claimDay,
    mintMyTicket,

    updateExtraTicketsPowerD,
    updateTicketPrice,
    finishRaffleRound,
    getWinnersFromOracleRandom,
    createRaffleRound,
  };
};
