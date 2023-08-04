import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Container, Grid, GridItem, Link, useDisclosure } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { useBuyTicketsLogger } from '@/hooks/logger/useBuyTicketsLogger';
import { useLottery, useLotteryControl } from '@/hooks/lottery/useLottery';
import { useLotteryRoundById } from '@/hooks/lottery/useLotteryRoundById';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useHelperLotteryRoundWinners } from '@/hooks/useHelper';
import { useLogger } from '@/hooks/useLogger';
import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { LotteryStatusEnum } from '@/utils/formatters/lottery';

import { BuyLotteryTicketsModal } from './BuyLotteryTicketsModal';
import { LotteryCountdown } from './LotteryCountdown';
import { LotteryDescription } from './LotteryDescrption';
import { LotteryEnter } from './LotteryEnter';
import { LotteryHeading } from './LotteryHeading';
import { LotterySummary } from './LotterySummary';
import { LotteryTickets } from './LotteryTickets';

export const LotteryPage = () => {
  const { id } = useParams();
  const roundId = useMemo(() => (id ? parseInt(id) - 1 : undefined), [id]);
  const {
    round,
    entryLottery,
    fetchRoundRequest: { refetch, isFetched },
    userRoundEntryRequest: { data: userEnteredTickets },
  } = useLotteryRoundById(roundId);

  useDocumentTitle(round ? `iSaver | Raffles - ${round.title}` : 'iSaver | Raffles');
  useMetaDescription(
    'iSaver Raffles joining gives you a chance to win big prizes! It`s easy, if you have a Ticket.'
  );

  const { isConnected, address } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Buy Ticket modal
  const navigate = useNavigateByHash();
  const { ticketBalanceRequest, buyTickets } = useLottery();
  const { ticketPrice } = useLotteryControl();
  const logBuyTickets = useBuyTicketsLogger('raffle');
  const logger = useLogger({
    category: 'elements',
    action: 'element_click',
    label: 'all_raffles',
    buttonLocation: 'up',
    actionGroup: 'interactions',
  });

  // Redirect to dashboard if round not found
  useEffect(() => {
    if ((isFetched && !round) || !id) {
      navigate('/');
    }
  }, [isFetched, round, navigate, id]);

  const handleOpenTicketModal = useCallback(() => {
    logBuyTickets();

    if (!isConnected) {
      connect();
    } else {
      onOpen();
    }
  }, [logBuyTickets, isConnected, connect, onOpen]);

  const handleEnterLottery = useCallback(
    (tickets: number) => {
      return entryLottery.mutateAsync({ roundId: roundId ?? -1, tickets });
    },
    [entryLottery, roundId]
  );

  const handleNavigateToRaffles = useCallback(() => {
    logger({ event: 'raffle' });
    navigate('/#raffles');
  }, [navigate, logger]);

  const isUpcoming = round?.status === LotteryStatusEnum.upcoming;
  const isActive = round?.status === LotteryStatusEnum.current;
  const isSoldOut = round?.status === LotteryStatusEnum.soldOut;
  const isPast = round?.status === LotteryStatusEnum.past;

  const roundWinners = useHelperLotteryRoundWinners(isPast ? roundId : undefined);

  const totalPrize = useMemo(() => {
    if (round) {
      return round.initialPrize.add(round.tokensForOneTicket.mul(round.totalTickets));
    } else return BigNumber.from(0);
  }, [round]);

  const userPrize = useMemo(
    () => roundWinners?.data?.find((winner) => winner.address === address)?.prize,
    [roundWinners.data, address]
  );
  return (
    <Container variant="dashboard">
      <Link
        textStyle="button"
        alignSelf="flex-start"
        my={{ sm: '20px', xl: '30px' }}
        onClick={handleNavigateToRaffles}
      >
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        All Raffles
      </Link>

      {round ? (
        <Grid
          gridTemplateColumns={{ sm: '1fr', lg: '1fr 1fr' }}
          gap={{ sm: '10px', xl: '20px' }}
          mb="100px"
        >
          <GridItem colSpan={2}>
            <LotteryHeading
              title={round.title}
              status={round.status}
              totalTickets={round.totalTickets}
            />
          </GridItem>

          <GridItem colSpan={{ sm: 2, lg: 1 }}>
            {!isPast ? (
              <Box mb={{ sm: '10px', xl: '20px' }}>
                <LotteryCountdown
                  startTime={round.startTime}
                  duration={round.duration}
                  onExpire={refetch}
                />
              </Box>
            ) : null}

            <Box>
              <LotteryDescription
                prize={totalPrize}
                description={round.description}
                winnersForLevel={round.winnersForLevel}
                prizeForLevel={round.prizeForLevel}
              />
            </Box>
          </GridItem>

          <GridItem colSpan={{ sm: 2, lg: 1 }}>
            <Box>
              <LotteryEnter
                maximumAvailableTickets={round.maxTicketsFromOneMember}
                userTickets={ticketBalanceRequest.data || 0}
                userEnteredTickets={userEnteredTickets || 0}
                showEntered={!isUpcoming && isConnected}
                isClosed={isSoldOut || isPast}
                isDisabled={!isActive}
                onEnter={handleEnterLottery}
              />
            </Box>

            <Box mt={{ sm: '10px', xl: '20px' }}>
              <LotteryTickets
                tickets={ticketBalanceRequest.data || 0}
                onBuyClick={handleOpenTicketModal}
              />
            </Box>

            {isPast ? (
              <Box mt={{ sm: '10px', xl: '20px' }}>
                <LotterySummary userPrize={userPrize} winners={roundWinners.data || []} />
              </Box>
            ) : null}
          </GridItem>
        </Grid>
      ) : (
        <Box height="500px" position="relative">
          <CenteredSpinner background="transparent" />
        </Box>
      )}

      {isOpen ? (
        <BuyLotteryTicketsModal
          isPageView
          ticketPrice={ticketPrice}
          onBuy={buyTickets.mutateAsync}
          onClose={onClose}
        />
      ) : null}
    </Container>
  );
};
