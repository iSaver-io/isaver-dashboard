import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { useAccount } from 'wagmi';

import { useDashboardConfigControl } from '@/hooks/admin/useDashboardConfigControl';
import { CreateLotteryProps, useLotteryContract } from '@/hooks/contracts/useLotteryContract';
import { useTicketContract } from '@/hooks/contracts/useTicketContract';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useNotification } from '@/hooks/useNotification';
import { SAV_BALANCE_REQUEST } from '@/hooks/useTokenBalance';
import { useTokens } from '@/hooks/useTokens';
import { parseLotteryFormat } from '@/utils/formatters/lottery';
import { bigNumberToString } from '@/utils/number';

import { useLotteryRoundAdditionalData } from './useLotteryRoundAdditionalData';

export const TICKET_BALANCE_REQUEST = 'ticket-balance-request';
const LOTTERY_ROUNDS_REQUEST = 'lottery-rounds-request';
const LOTTERY_TICKET_PRICE_REQUEST = 'lottery-ticket-price-request';
const LOTTERY_WINNER_PRIZE_REQUEST = 'lottery-winner-prize-request';
const BUY_TICKETS_MUTATION = 'buy-tickets-mutation';

export type CreateLotteryWithTitleProps = CreateLotteryProps & {
  title: string;
  description?: string;
};
export const useLotteryControl = () => {
  const lotteryContract = useLotteryContract();
  const { raffleRoundDataMap, isRafflesDataLoading } = useLotteryRoundAdditionalData();
  const queryClient = useQueryClient();
  const { success, handleError } = useNotification();
  const { isAuthorized, signIn, setRaffleRoundParams } = useDashboardConfigControl();

  const roundsRequest = useQuery([LOTTERY_ROUNDS_REQUEST], () => lotteryContract.getRounds());

  const lotteryRounds = useMemo(() => {
    if (roundsRequest.data && raffleRoundDataMap) {
      return roundsRequest.data
        .map((round) => parseLotteryFormat(round, raffleRoundDataMap))
        .sort((a, b) => b.id - a.id);
    }
    return undefined;
  }, [roundsRequest.data, raffleRoundDataMap]);

  const ticketPriceRequest = useQuery([LOTTERY_TICKET_PRICE_REQUEST], async () => {
    return await lotteryContract.getTicketPrice();
  });

  const ticketPrice = useMemo(
    () => ticketPriceRequest.data || BigNumber.from(0),
    [ticketPriceRequest.data]
  );

  const updateTicketPrice = useMutation(
    ['update-ticket-price'],
    async (price: number) => {
      const priceBN = parseEther(price.toString());

      const txHash = await lotteryContract.updateTicketPrice(priceBN);
      success({
        title: 'Success',
        description: `Ticket price changed to ${bigNumberToString(priceBN)} SAV`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LOTTERY_TICKET_PRICE_REQUEST]);
      },
      onError: handleError,
    }
  );

  const finishLotteryRound = useMutation(
    ['finish-lottery-round'],
    async ({ roundId }: { roundId: number }) => {
      const txHash = await lotteryContract.finishLotteryRound(roundId);
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
        queryClient.invalidateQueries([LOTTERY_ROUNDS_REQUEST]);
      },
      onError: handleError,
    }
  );

  const manuallyGetWinners = useMutation(
    ['get-lottery-round-winners'],
    async (roundId: number) => {
      const txHash = await lotteryContract.manuallyGetWinners(roundId);
      success({
        title: 'Success',
        description: `Raffle round ${roundId + 1} is finished. Winners are determined.`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LOTTERY_ROUNDS_REQUEST]);
      },
      onError: handleError,
    }
  );

  const createLotteryRound = useMutation(
    ['create-lottery-round'],
    async ({ title, description, ...props }: CreateLotteryWithTitleProps) => {
      if (!isAuthorized) {
        signIn();
        return;
      }
      await setRaffleRoundParams(roundsRequest.data?.length || 0, title, description);
      const txHash = await lotteryContract.createLotteryRound(props);
      success({ title: 'Success', description: 'Raffle round has been created', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LOTTERY_ROUNDS_REQUEST]);
      },
      onError: handleError,
    }
  );

  return {
    ticketPriceRequest,
    ticketPrice,
    roundsRequest,
    isRafflesDataLoading,
    lotteryRounds,
    updateTicketPrice,
    finishLotteryRound,
    manuallyGetWinners,
    createLotteryRound,
  };
};

export const useLottery = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const lotteryContract = useLotteryContract();
  const { ticketPrice } = useLotteryControl();
  const ticketContract = useTicketContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();

  const userTotalPrizeRequest = useQuery([LOTTERY_WINNER_PRIZE_REQUEST, { account }], async () => {
    return account ? await lotteryContract.getWinnerTotalPrize(account) : null;
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
        spender: lotteryContract.address,
        requiredAmount: (ticketPrice || BigNumber.from(10).pow(21)).mul(amount),
      });

      const txHash = await lotteryContract.buyTickets(amount);
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
    lotteryContract,
    ticketContract,

    userTotalPrizeRequest,
    ticketBalanceRequest,
    buyTickets,
  };
};
