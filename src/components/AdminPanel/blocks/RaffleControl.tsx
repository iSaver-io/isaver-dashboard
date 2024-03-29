import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';

import { AddRaffleRound } from '@/components/AdminPanel/common/AddRaffleRound';
import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { RaffleStatus } from '@/components/Raffle/RaffleStatus';
import { Button } from '@/components/ui/Button/Button';
import { useRaffleControl, useTicketPrice } from '@/hooks/raffle/useRaffle';
import { RaffleStatusEnum } from '@/utils/formatters/raffle';
import { getLocalDateTimeString, getStampsFromDuration } from '@/utils/time';

export const RaffleControl = () => {
  const {
    roundsRequest,
    isRafflesDataLoading,
    raffleRounds,
    finishRaffleRound,
    getWinnersFromOracleRandom,
    createRaffleRound,
  } = useRaffleControl();
  const { ticketPriceRequest } = useTicketPrice();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AdminSection
      title="Raffles"
      isLoading={ticketPriceRequest.isLoading || roundsRequest.isLoading || isRafflesDataLoading}
    >
      <>
        <Button size="sm" onClick={onOpen}>
          Create raffle round
        </Button>

        <Box mt="16px" maxHeight="400px" overflowY="auto">
          {raffleRounds?.map((round) => (
            <RaffleRoundInfo
              key={round.id}
              {...round}
              onCloseRound={() => finishRaffleRound.mutateAsync({ roundId: round.id })}
              onFinishRound={() => getWinnersFromOracleRandom.mutateAsync(round.id)}
            />
          ))}
        </Box>

        {isOpen ? (
          <AddRaffleRound onClose={onClose} onSubmit={createRaffleRound.mutateAsync} />
        ) : null}
      </>
    </AdminSection>
  );
};

type RaffleRoundInfoProps = {
  title: string;
  startTime: number;
  duration: number;
  isClosed: boolean;
  isOracleFulfilled: boolean;
  isFinished: boolean;
  winnersForLevel: number[];
  prizeForLevel: number[];
  status: RaffleStatusEnum;
  totalTickets: number;
  onCloseRound: () => Promise<void>;
  onFinishRound: () => Promise<void>;
};
const RaffleRoundInfo: FC<RaffleRoundInfoProps> = ({
  title,
  startTime,
  duration,
  isClosed,
  isOracleFulfilled,
  isFinished,
  winnersForLevel,
  prizeForLevel,
  status,
  totalTickets,
  onCloseRound,
  onFinishRound,
}) => {
  const [isLoadingClose, setIsLoadingClose] = useState(false);
  const [isLoadingFinish, setIsLoadingFinish] = useState(false);

  const handleCloseRound = useCallback(() => {
    setIsLoadingClose(true);
    onCloseRound().finally(() => setIsLoadingClose(false));
  }, [onCloseRound, setIsLoadingClose]);

  const handleFinishRound = useCallback(() => {
    setIsLoadingFinish(true);
    onFinishRound().finally(() => setIsLoadingFinish(false));
  }, [onFinishRound, setIsLoadingFinish]);

  const levels = winnersForLevel.length;

  const roundStatus = useMemo(() => {
    if (isClosed && !isFinished) return RaffleStatusEnum.closed;
    return status;
  }, [isClosed, status, isFinished]);

  const durationStampsString = useMemo(() => {
    const stamps = getStampsFromDuration(duration * 1000);
    const daysString = stamps.days.toString().padStart(2, '0');
    const hoursString = stamps.hours.toString().padStart(2, '0');
    const minsString = stamps.minutes.toString().padStart(2, '0');
    const secString = stamps.seconds.toString().padStart(2, '0');
    return `${daysString}d-${hoursString}h-${minsString}m-${secString}s`;
  }, [duration]);

  const Label = (props: any) => <Text opacity="0.5" {...props}></Text>;
  const Value = (props: any) => <Text {...props}></Text>;

  return (
    <Box
      textStyle="text1"
      fontSize="16px"
      _notFirst={{ mt: '16px' }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="sm"
      padding="8px"
    >
      <Flex alignItems="center" mb="16px">
        <Text mr="12px">{title}</Text>
        <RaffleStatus status={roundStatus} noBorder />

        {roundStatus === RaffleStatusEnum.soldOut ? (
          <Button
            variant="filledRed"
            size="sm"
            ml="20px"
            padding="2px 8px"
            isLoading={isLoadingClose}
            onClick={handleCloseRound}
          >
            Close
          </Button>
        ) : null}

        {roundStatus === RaffleStatusEnum.closed && isOracleFulfilled ? (
          <Button
            variant="filledRed"
            size="sm"
            ml="20px"
            padding="2px 8px"
            isLoading={isLoadingFinish}
            onClick={handleFinishRound}
          >
            Finish
          </Button>
        ) : null}
      </Flex>

      <Flex mb="8px">
        <Flex>
          <Label width="75px">Start at:</Label>
          <Value width="200px">{getLocalDateTimeString(startTime)}</Value>
        </Flex>

        <Flex>
          <Label width="85px">Duration:</Label>
          <Value width="200px">{durationStampsString}</Value>
        </Flex>

        <Flex>
          <Label width="60px">Levels:</Label>
          <Value width="80px">{levels}</Value>
        </Flex>
      </Flex>

      <Flex>
        <Flex>
          <Flex>
            <Label width="110px">Total Tickets:</Label>
            <Value width="100px">{totalTickets}</Value>
          </Flex>

          <Flex>
            <Label width="150px">Winners for level:</Label>
            <Value width="200px">{winnersForLevel.join(', ')}</Value>
          </Flex>

          <Flex>
            <Label width="120px">Prize for level:</Label>
            <Value width="200px">{prizeForLevel.map((p) => `${p}%`).join(', ')}</Value>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
