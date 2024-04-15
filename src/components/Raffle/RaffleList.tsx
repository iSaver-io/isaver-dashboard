import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  ButtonGroup,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { StatBlock } from '@/components/ui/StatBlock/StatBlock';
import { useRaffle } from '@/hooks/raffle/useRaffle';
import { useRaffleRounds } from '@/hooks/raffle/useRaffleRounds';
import { useLogger } from '@/hooks/useLogger';
import { useTicketsBalance } from '@/hooks/useTicketsBalance';
import {
  getNextRaffleTimestamp,
  RaffleRoundType,
  RaffleStatusEnum,
} from '@/utils/formatters/raffle';
import { getReadableAmount } from '@/utils/number';

import { RaffleItem } from './RaffleItem';

export const RaffleList = () => {
  const { isConnected } = useAccount();
  const [stateFilter, setStateFilter] = useState<RaffleStatusEnum>(RaffleStatusEnum.current);
  const navigate = useNavigate();
  const logger = useLogger({
    event: 'dashboard',
    category: 'elements',
    buttonLocation: 'down',
    actionGroup: 'interactions',
  });

  const { userTotalPrizeRequest } = useRaffle();
  const ticketBalanceRequest = useTicketsBalance();
  const { upcomingRounds, liveRounds, finishedRounds, activeRoundsRequest, finishedRoundsRequest } =
    useRaffleRounds();

  const updateRafflesState = useCallback(() => {
    if ([RaffleStatusEnum.upcoming, RaffleStatusEnum.current].includes(stateFilter)) {
      activeRoundsRequest.refetch();
    } else {
      finishedRoundsRequest.refetch();
    }
  }, [stateFilter, activeRoundsRequest, finishedRoundsRequest]);

  const updateRafflesStateFilter = useCallback(
    (state: RaffleStatusEnum) => {
      logger({ action: 'element_click', label: state });
      setStateFilter(state);
    },
    [logger]
  );
  const navigateToRaffle = useCallback(
    (raffleId: number) => {
      logger({ action: 'button_click', label: 'see_details' });
      navigate(`/raffles/${raffleId}`);
    },
    [logger, navigate]
  );

  const isLoading =
    stateFilter === RaffleStatusEnum.past
      ? finishedRoundsRequest.isLoading
      : activeRoundsRequest.isLoading;

  const loadedStateFilter = useMemo(() => {
    if (stateFilter === RaffleStatusEnum.current && liveRounds.length > 0) return stateFilter;
    if (stateFilter === RaffleStatusEnum.upcoming && upcomingRounds.length > 0) return stateFilter;
    if (stateFilter === RaffleStatusEnum.past) {
      return stateFilter;
    }

    return (
      (liveRounds.length > 0 && RaffleStatusEnum.current) ||
      (upcomingRounds.length > 0 && RaffleStatusEnum.upcoming) ||
      RaffleStatusEnum.past
    );
  }, [stateFilter, liveRounds, upcomingRounds]);

  const raffles: RaffleRoundType[] | undefined =
    loadedStateFilter === RaffleStatusEnum.current
      ? liveRounds
      : loadedStateFilter === RaffleStatusEnum.upcoming
      ? upcomingRounds
      : (finishedRounds as RaffleRoundType[]);

  return (
    <Container variant="dashboard" paddingX={{ sm: '10px', md: 'unset' }}>
      <Flex
        width="100%"
        gap={{ sm: '20px', md: '30px', lg: '20px' }}
        direction={{ sm: 'column', xl: 'row' }}
        justifyContent="space-between"
        flexWrap="wrap"
        paddingX={{ md: '10px', lg: 'unset' }}
      >
        <Box width={{ sm: '100%', xl: '50%' }}>
          <Text textStyle="sectionHeading" mb="20px">
            Win big prizes
          </Text>

          <Text textStyle="text1">
            iSaver Monthly Raffles gives you a chance to win SAVR tokens! And get ready for a new
            experience in Momento - instant Win-Win Raffle of various NFTs and tokens. Just hit GO!
            It's easy, if you have a Ticket.
          </Text>
        </Box>

        {!isConnected ? (
          <ConnectWalletButton location="down" alignSelf="flex-start" />
        ) : (
          <Button
            onClick={() => navigate('/momento')}
            width={{ sm: '100%', lg: '50%', xl: 'unset' }}
          >
            Go and win
          </Button>
        )}
      </Flex>

      <Flex
        mt={{ sm: '30px', lg: '40px', xl: '50px' }}
        mb="30px"
        direction={{ sm: 'column-reverse', xl: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'flex-start', xl: 'flex-end' }}
      >
        <ButtonGroup isAttached size={{ sm: 'md', md: 'lg' }} mt={{ sm: '50px', xl: 'unset' }}>
          <Button
            borderRadius="sm"
            isDisabled={!liveRounds.length}
            variant={loadedStateFilter === RaffleStatusEnum.current ? 'active' : 'inactive'}
            onClick={() => updateRafflesStateFilter(RaffleStatusEnum.current)}
          >
            Live
          </Button>
          <Button
            borderRadius="sm"
            isDisabled={!upcomingRounds.length}
            variant={loadedStateFilter === RaffleStatusEnum.upcoming ? 'active' : 'inactive'}
            onClick={() => updateRafflesStateFilter(RaffleStatusEnum.upcoming)}
          >
            Upcoming
          </Button>
          <Button
            borderRadius="sm"
            variant={loadedStateFilter === RaffleStatusEnum.past ? 'active' : 'inactive'}
            onClick={() => updateRafflesStateFilter(RaffleStatusEnum.past)}
          >
            Past
          </Button>
        </ButtonGroup>
        <StatBlock
          containerWidth={{ sm: '100%', lg: '510px', xl: 'unset' }}
          leftWidth={{ sm: '50%', lg: '260px' }}
          leftTitle="Your Tickets"
          leftValue={ticketBalanceRequest.data || 0}
          rightWidth={{ sm: '50%', md: '260px' }}
          rightTitle="Total Raffles Rewards"
          rightValue={getReadableAmount(userTotalPrizeRequest.data || 0)}
          rightCurrency="SAVR"
        />
      </Flex>

      <Grid
        templateColumns={{ sm: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
        gap={{ base: '20px', lg: '10px' }}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <GridItem w="100%" key={index}>
                <Skeleton
                  height={{ sm: '240px', '2xl': '287px' }}
                  borderRadius="md"
                  startColor="gray.200"
                  endColor="bgGreen.200"
                />
              </GridItem>
            ))
          : null}

        {raffles?.map(({ title, startTime, status, duration, id }) => (
          <GridItem w="100%" key={id}>
            <RaffleItem
              title={title}
              status={status}
              timestamp={getNextRaffleTimestamp({ startTime, duration, status }) * 1000}
              onDetails={() => navigateToRaffle(id + 1)}
              onExpire={updateRafflesState}
            />
          </GridItem>
        ))}
      </Grid>

      {!isLoading && !raffles?.length ? (
        <Center mt="60px">
          <Text textStyle="textMedium" opacity={0.3}>
            No Raffle rounds yet
          </Text>
        </Center>
      ) : null}

      {loadedStateFilter === RaffleStatusEnum.past && finishedRoundsRequest.hasNextPage ? (
        <Center mt="30px">
          <Button variant="link" onClick={() => finishedRoundsRequest.fetchNextPage()}>
            Load more
          </Button>
        </Center>
      ) : null}
    </Container>
  );
};
