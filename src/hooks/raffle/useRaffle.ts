import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { useAccount } from 'wagmi';

import { useDashboardConfigControl } from '@/hooks/admin/useDashboardConfigControl';
import { CreateRaffleProps, useRaffleContract } from '@/hooks/contracts/useRaffleContract';
import { useTicketContract } from '@/hooks/contracts/useTicketContract';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useNotification } from '@/hooks/useNotification';
import { SAV_BALANCE_REQUEST } from '@/hooks/useTokenBalance';
import { useTokens } from '@/hooks/useTokens';
import { parseRaffleFormat } from '@/utils/formatters/raffle';
import { bigNumberToString } from '@/utils/number';

import { useRaffleRoundAdditionalData } from './useRaffleRoundAdditionalData';

export const TICKET_BALANCE_REQUEST = 'ticket-balance-request';
const RAFFLE_ROUNDS_REQUEST = 'raffle-rounds-request';
const RAFFLE_TICKET_PRICE_REQUEST = 'raffle-ticket-price-request';
const RAFFLE_WINNER_PRIZE_REQUEST = 'raffle-winner-prize-request';
const BUY_TICKETS_MUTATION = 'buy-tickets-mutation';

export type CreateRaffleWithTitleProps = CreateRaffleProps & {
  title: string;
  description?: string;
};
export const useRaffleControl = () => {
  const raffleContract = useRaffleContract();
  const { raffleRoundDataMap, isRafflesDataLoading } = useRaffleRoundAdditionalData();
  const queryClient = useQueryClient();
  const { success, handleError } = useNotification();
  const { isAuthorized, signIn, setRaffleRoundParams } = useDashboardConfigControl();

  const roundsRequest = useQuery([RAFFLE_ROUNDS_REQUEST], () => raffleContract.getRounds());

  const raffleRounds = useMemo(() => {
    if (roundsRequest.data && raffleRoundDataMap) {
      return roundsRequest.data
        .map((round) => parseRaffleFormat(round, raffleRoundDataMap))
        .sort((a, b) => b.id - a.id);
    }
    return undefined;
  }, [roundsRequest.data, raffleRoundDataMap]);

  const ticketPriceRequest = useQuery([RAFFLE_TICKET_PRICE_REQUEST], async () => {
    return await raffleContract.getTicketPrice();
  });

  const ticketPrice = useMemo(
    () => ticketPriceRequest.data || BigNumber.from(0),
    [ticketPriceRequest.data]
  );

  const updateTicketPrice = useMutation(
    ['update-ticket-price'],
    async (price: number) => {
      const priceBN = parseEther(price.toString());

      const txHash = await raffleContract.updateTicketPrice(priceBN);
      success({
        title: 'Success',
        description: `Ticket price changed to ${bigNumberToString(priceBN)} SAV`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([RAFFLE_TICKET_PRICE_REQUEST]);
      },
      onError: handleError,
    }
  );

  const finishRaffleRound = useMutation(
    ['finish-raffle-round'],
    async ({ roundId }: { roundId: number }) => {
      const txHash = await raffleContract.finishRaffleRound(roundId);
      success({
        title: 'Success',
        description: `Raffle round ${
          roundId + 1
        } is closed. Oracle will fullfil round with random word in about 2 minutes.`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([RAFFLE_ROUNDS_REQUEST]);
      },
      onError: handleError,
    }
  );

  const getWinnersFromOracleRandom = useMutation(
    ['get-raffle-round-winners'],
    async (roundId: number) => {
      const txHash = await raffleContract.getWinnersFromOracleRandom(roundId);
      success({
        title: 'Success',
        description: `Raffle round ${roundId + 1} is finished. Winners are determined.`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([RAFFLE_ROUNDS_REQUEST]);
      },
      onError: handleError,
    }
  );

  const createRaffleRound = useMutation(
    ['create-raffle-round'],
    async ({ title, description, ...props }: CreateRaffleWithTitleProps) => {
      if (!isAuthorized) {
        signIn();
        return;
      }
      await setRaffleRoundParams(roundsRequest.data?.length || 0, title, description);
      const txHash = await raffleContract.createRaffleRound(props);
      success({ title: 'Success', description: 'Raffle round has been created', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([RAFFLE_ROUNDS_REQUEST]);
      },
      onError: handleError,
    }
  );

  return {
    ticketPriceRequest,
    ticketPrice,
    roundsRequest,
    isRafflesDataLoading,
    raffleRounds,
    updateTicketPrice,
    finishRaffleRound,
    getWinnersFromOracleRandom,
    createRaffleRound,
  };
};

export const useRaffle = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const raffleContract = useRaffleContract();
  const { ticketPrice } = useRaffleControl();
  const ticketContract = useTicketContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();

  const userTotalPrizeRequest = useQuery([RAFFLE_WINNER_PRIZE_REQUEST, { account }], async () => {
    return account ? await raffleContract.getWinnerTotalPrize(account) : null;
  });

  const ticketBalanceRequest = useQuery(
    [TICKET_BALANCE_REQUEST, { account }],
    async () => {
      return account ? await ticketContract.balanceOf(account) : null;
    },
    {
      select: (data) => data?.toNumber(),
    }
  );

  const buyTickets = useMutation(
    [BUY_TICKETS_MUTATION],
    async (amount: number) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: raffleContract.address,
        requiredAmount: (ticketPrice || BigNumber.from(10).pow(21)).mul(amount),
      });

      const txHash = await raffleContract.buyTickets(amount);
      success({ title: 'Success', description: `You bought ${amount} Raffle Tickets`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TICKET_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: handleError,
    }
  );

  return {
    raffleContract,
    ticketContract,

    userTotalPrizeRequest,
    ticketBalanceRequest,
    buyTickets,
  };
};