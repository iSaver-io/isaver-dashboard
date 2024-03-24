import { useCallback, useMemo } from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import { ReactComponent as RepeatIcon } from '@/assets/images/icons/repeat.svg';

import TicketImage from './images/ticket.png';
import TicketActiveImage from './images/ticket-active.png';
import TicketEmpty from './images/ticket-empty.png';
import TicketEmptyBorder from './images/ticket-empty-border.png';

export enum TicketStates {
  Initial,
  TicketPlaced,
  TicketBurnLoading,
  TicketBurned,
  OracleResponded,
  TicketGoLoading,
  Finished,
}

interface TicketProps {
  tip: string;
  hasTickets: boolean;
  state: TicketStates;
  onClick: () => void;
}

export const Ticket = ({ tip, state, hasTickets, onClick }: TicketProps) => {
  const bp = useBreakpoint({ ssr: false });

  const isSm = useMemo(() => ['sm', 'md', 'lg'].includes(bp), [bp]);

  const handleClick = useCallback(
    (event: any) => {
      if (event.detail === 2 || ((isSm || state === TicketStates.Finished) && event.detail === 1)) {
        onClick();
      }
    },
    [isSm, onClick, state]
  );

  const isActive = useMemo(
    () => ![TicketStates.Initial, TicketStates.Finished].includes(state),
    [state]
  );

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      mt={{ sm: '30px' }}
      pb={{ sm: '58px', lg: '38px', xl: '48px' }}
    >
      {/* Hack for image preloading */}
      <Box position="absolute" w="1px" h="1px" opacity="0" top="-10000000px" left="-10000000px">
        <img src={TicketEmptyBorder} alt="Ticket" />
        <img src={TicketEmpty} alt="Ticket" />
        <img src={TicketImage} alt="Ticket" />
        <img src={TicketActiveImage} alt="Ticket" />
      </Box>

      <Flex
        className="momento_ticket"
        justifyContent="center"
        alignItems="center"
        px="55px"
        cursor={hasTickets && !isActive ? 'pointer' : undefined}
        onClick={hasTickets && !isActive ? handleClick : undefined}
      >
        {!isActive ? (
          <>
            <img
              className="momento_ticket_image"
              src={hasTickets ? TicketEmptyBorder : TicketEmpty}
              alt="Ticket"
            />
            {hasTickets ? (
              state === TicketStates.Finished ? (
                // if replay
                <Flex color="sav" alignItems="center">
                  <Box width="28px" height="28px" mr="5px">
                    <RepeatIcon />
                  </Box>
                  <Text textStyle="button" fontSize={{ xl: '18px' }}>
                    Again
                  </Text>
                </Flex>
              ) : (
                // if first play
                <Text textStyle="textSansSmall">
                  {isSm ? 'Tap' : 'Double-click'} to activate your Ticket
                </Text>
              )
            ) : (
              <Text textStyle="textSansSmall">You need a Ticket to&nbsp;start</Text>
            )}
          </>
        ) : null}

        {[TicketStates.TicketPlaced, TicketStates.TicketBurnLoading].includes(state) ? (
          <img className="momento_ticket_image" src={TicketImage} alt="Ticket" />
        ) : null}

        {[
          TicketStates.TicketBurned,
          TicketStates.OracleResponded,
          TicketStates.TicketGoLoading,
        ].includes(state) ? (
          <img className="momento_ticket_image active" src={TicketActiveImage} alt="Ticket" />
        ) : null}
      </Flex>

      <Text
        position="absolute"
        bottom="0"
        whiteSpace="nowrap"
        display={{ sm: tip ? 'unset' : 'none', lg: 'unset' }}
        height={{ sm: '18px', xl: '24px' }}
        fontSize={{ sm: '12px', xl: '16px' }}
        fontWeight={{ xl: '500' }}
      >
        {tip || ''}
      </Text>
    </Flex>
  );
};
