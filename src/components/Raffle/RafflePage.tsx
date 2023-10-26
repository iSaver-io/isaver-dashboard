import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Container, Grid, GridItem, Link, useDisclosure } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { useBuyTicketsLogger } from '@/hooks/logger/useBuyTicketsLogger';
import { useRaffle, useRaffleControl } from '@/hooks/raffle/useRaffle';
import { useRaffleRoundById } from '@/hooks/raffle/useRaffleRoundById';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useHelperRaffleRoundWinners } from '@/hooks/useHelper';
import { useLogger } from '@/hooks/useLogger';
import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { RaffleStatusEnum } from '@/utils/formatters/raffle';

import { BuyRaffleTicketsModal } from './BuyRaffleTicketsModal';
import { RaffleCountdown } from './RaffleCountdown';
import { RaffleDescription } from './RaffleDescrption';
import { RaffleEnter } from './RaffleEnter';
import { RaffleHeading } from './RaffleHeading';
import { RaffleSummary } from './RaffleSummary';
import { RaffleTickets } from './RaffleTickets';

export const RafflePage = () => {
  const { id } = useParams();
  const roundId = useMemo(() => (id ? parseInt(id) - 1 : undefined), [id]);
  const {
    round,
    entryRaffle,
    fetchRoundRequest: { refetch },
    isRoundLoading,
    userRoundEntryRequest: { data: userEnteredTickets },
  } = useRaffleRoundById(roundId);

  useDocumentTitle(round ? `iSaver | Raffles - ${round.title}` : 'iSaver | Raffles');
  useMetaDescription(
    'iSaver Raffles joining gives you a chance to win big prizes! It`s easy, if you have a Ticket.'
  );

  const { isConnected, address } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Buy Ticket modal
  const navigate = useNavigateByHash();
  const { ticketBalanceRequest, buyTickets } = useRaffle();
  const { ticketPrice } = useRaffleControl();
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
    if ((!isRoundLoading && !round) || !id) {
      navigate('/');
    }
  }, [isRoundLoading, round, navigate, id]);

  const handleOpenTicketModal = useCallback(() => {
    logBuyTickets();

    if (!isConnected) {
      connect();
    } else {
      onOpen();
    }
  }, [logBuyTickets, isConnected, connect, onOpen]);

  const handleEnterRaffle = useCallback(
    (tickets: number) => {
      return entryRaffle.mutateAsync({ roundId: roundId ?? -1, tickets });
    },
    [entryRaffle, roundId]
  );

  const handleNavigateToRaffles = useCallback(() => {
    logger({ event: 'raffle' });
    navigate('/#raffles');
  }, [navigate, logger]);

  const isUpcoming = round?.status === RaffleStatusEnum.upcoming;
  const isActive = round?.status === RaffleStatusEnum.current;
  const isSoldOut = round?.status === RaffleStatusEnum.soldOut;
  const isPast = round?.status === RaffleStatusEnum.past;

  const roundWinners = useHelperRaffleRoundWinners(isPast ? roundId : undefined);

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
            <RaffleHeading
              title={round.title}
              status={round.status}
              totalTickets={round.totalTickets}
            />
          </GridItem>

          <GridItem colSpan={{ sm: 2, lg: 1 }}>
            {!isPast ? (
              <Box mb={{ sm: '10px', xl: '20px' }}>
                <RaffleCountdown
                  startTime={round.startTime}
                  duration={round.duration}
                  onExpire={refetch}
                />
              </Box>
            ) : null}

            <Box>
              <RaffleDescription
                prize={totalPrize}
                description={round.description}
                winnersForLevel={round.winnersForLevel}
                prizeForLevel={round.prizeForLevel}
              />
            </Box>
          </GridItem>

          <GridItem colSpan={{ sm: 2, lg: 1 }}>
            <Box>
              <RaffleEnter
                maximumAvailableTickets={round.maxTicketsFromOneMember}
                userTickets={ticketBalanceRequest.data || 0}
                userEnteredTickets={userEnteredTickets || 0}
                showEntered={!isUpcoming && isConnected}
                isClosed={isSoldOut || isPast}
                isDisabled={!isActive}
                onEnter={handleEnterRaffle}
              />
            </Box>

            <Box mt={{ sm: '10px', xl: '20px' }}>
              <RaffleTickets
                tickets={ticketBalanceRequest.data || 0}
                onBuyClick={handleOpenTicketModal}
              />
            </Box>

            {isPast ? (
              <Box mt={{ sm: '10px', xl: '20px' }}>
                <RaffleSummary userPrize={userPrize} winners={roundWinners.data || []} />
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
        <BuyRaffleTicketsModal
          isPageView
          ticketPrice={ticketPrice}
          onBuy={buyTickets.mutateAsync}
          onClose={onClose}
        />
      ) : null}
    </Container>
  );
};
