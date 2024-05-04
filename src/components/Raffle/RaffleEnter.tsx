import { ChangeEvent, FC, useCallback, useState } from 'react';
import { AddIcon, MinusIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Input, Text } from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';
import { useLogger } from '@/hooks/useLogger';

type RaffleEnterProps = {
  maximumAvailableTickets: number;
  userEnteredTickets?: number;
  userTickets?: number;
  isDisabled: boolean;
  showEntered: boolean;
  isClosed: boolean;
  onEnter: (tickets: number) => Promise<void>;
};
export const RaffleEnter: FC<RaffleEnterProps> = ({
  maximumAvailableTickets,
  userEnteredTickets,
  userTickets,
  isDisabled,
  showEntered,
  isClosed,
  onEnter,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState(0);
  const logger = useLogger({
    event: 'raffle',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'mid',
    actionGroup: 'interactions',
  });

  const leftTickets = userEnteredTickets
    ? maximumAvailableTickets - userEnteredTickets
    : maximumAvailableTickets;

  const increase = useCallback(() => {
    setTickets((prev) => prev + 1);
    logger({ label: 'plus' });
  }, [logger]);
  const decrease = useCallback(() => {
    setTickets((prev) => prev - 1);
    logger({ label: 'minus' });
  }, [logger]);
  const handleTicketsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const leftTrimmed = Math.min(value, leftTickets);
    const userBalanceTrimmed =
      userTickets !== undefined ? Math.min(userTickets, leftTrimmed) : leftTrimmed;
    setTickets(userBalanceTrimmed);
  };

  const handleEnter = useCallback(() => {
    setIsLoading(true);
    onEnter(tickets)
      .then(() => {
        setTickets(0);
      })
      .finally(() => {
        setIsLoading(false);
      });

    logger({
      action: 'button_click',
      label: 'enter_now',
      value: tickets,
      actionGroup: 'conversions',
    });
  }, [setIsLoading, onEnter, tickets, logger]);

  const canIncrease = userTickets ? tickets < leftTickets && tickets < userTickets : false;
  const isClosedEmpty = isClosed && !userEnteredTickets;

  return (
    <Box borderRadius="md" overflow="hidden">
      {showEntered ? (
        <Box
          bgColor={isClosedEmpty ? 'gray.200' : '#1b5b52'}
          textAlign="center"
          textStyle="text1"
          textTransform="uppercase"
          padding={{ sm: '18px', md: '20px', lg: '16px', xl: '20px', '2xl': '28px' }}
          fontSize={{ sm: '12px', md: '18px', lg: '12px', xl: '18px', '2xl': '26px' }}
          fontWeight={{ sm: '600', '2xl': '700' }}
        >
          {isClosedEmpty ? (
            'Tickets not placed'
          ) : (
            <>
              You have placed{' '}
              <Text
                as="span"
                color="green.400"
                fontSize={{ sm: '16px', md: '26px', lg: '16px', xl: '26px', '2xl': '38px' }}
              >
                {userEnteredTickets}
              </Text>{' '}
              Tickets
            </>
          )}
        </Box>
      ) : null}
      {!isClosed ? (
        <Box
          bgColor="bgGreen.50"
          padding={{ sm: '20px 10px 30px', '2xl': '40px' }}
          boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
        >
          <Flex
            mb={{ sm: '22px', '2xl': '40px' }}
            direction={{ sm: 'column', '2xl': 'row' }}
            alignItems="center"
          >
            <Text
              textStyle="text1"
              fontSize="18px"
              mb={{ sm: '22px', '2xl': 'unset' }}
              width={{ sm: '260px', '2xl': 'unset' }}
              textAlign={{ sm: 'center', '2xl': 'left' }}
            >
              You can use a maximum of{' '}
              <Text as="span" color="green.400" textStyle="textBold">
                {maximumAvailableTickets}
              </Text>{' '}
              Tickets in this Raffle {userEnteredTickets ? <>({leftTickets}&nbsp;left)</> : null}
            </Text>

            <Flex alignItems="center" ml={{ '2xl': '60px' }}>
              <IconButton
                variant="outlinedShadow"
                aria-label="sub"
                isDisabled={isLoading || isDisabled || tickets <= 0}
                onClick={decrease}
                size={{ sm: 'md', '2xl': 'lg' }}
                padding={{ sm: '0' }}
              >
                <MinusIcon />
              </IconButton>

              <Input
                value={tickets}
                variant="transparent"
                width="80px"
                textAlign="center"
                textStyle="textRegular"
                fontSize="41px"
                onChange={handleTicketsChange}
              />

              <IconButton
                variant="outlinedShadow"
                aria-label="add"
                isDisabled={isLoading || isDisabled || !canIncrease}
                onClick={increase}
                size={{ sm: 'md', '2xl': 'lg' }}
                padding={{ sm: '0' }}
              >
                <AddIcon />
              </IconButton>
            </Flex>
          </Flex>

          <Button
            variant="outlinedShadow"
            width="100%"
            isLoading={isLoading}
            isDisabled={isDisabled || !tickets}
            onClick={handleEnter}
          >
            Enter now
          </Button>

          {true || (!isDisabled && tickets > 0) ? (
            <Flex color="error" mt="30px">
              <WarningTwoIcon mr="10px" mt="4px" />
              <Text textStyle="text1">
                After the bet you will not be able to take your Tickets back
              </Text>
            </Flex>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
};
