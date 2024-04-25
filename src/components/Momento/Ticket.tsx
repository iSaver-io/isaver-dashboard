import { useCallback, useMemo } from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import { ReactComponent as RepeatIcon } from '@/assets/images/icons/repeat.svg';
import { useLogger } from '@/hooks/useLogger';

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
  const logger = useLogger({
    event: 'momento',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'up',
  });

  const handleClick = useCallback(
    (event: any) => {
      if (event.detail === 2) {
        logger({ label: 'double_click', actionGroup: 'conversions' });
      }
      if (state === TicketStates.Finished) {
        logger({ label: 'again', actionGroup: 'interactions' });
      }
      if (event.detail === 2 || ((isSm || state === TicketStates.Finished) && event.detail === 1)) {
        onClick();
      }
    },
    [isSm, onClick, state, logger]
  );

  const isActive = useMemo(
    () => ![TicketStates.Initial, TicketStates.Finished].includes(state),
    [state]
  );

  const isActiveImage = [
    TicketStates.TicketBurned,
    TicketStates.OracleResponded,
    TicketStates.TicketGoLoading,
  ].includes(state);

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      overflow="visible"
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
        overflow="visible"
        width={isActiveImage ? '251px' : undefined}
        margin={isActiveImage ? '0 -7px' : undefined}
        cursor={!isActive && (hasTickets || state !== TicketStates.Initial) ? 'pointer' : undefined}
        onClick={
          !isActive && (hasTickets || state !== TicketStates.Initial) ? handleClick : undefined
        }
      >
        {!isActive ? (
          <>
            <img
              className="momento_ticket_image"
              src={hasTickets && state === TicketStates.Initial ? TicketEmptyBorder : TicketEmpty}
              alt="Ticket"
            />
            {state === TicketStates.Finished ? (
              // if replay
              <Flex color="sav" alignItems="center">
                <Box width="28px" height="28px" mr="5px" zIndex={10}>
                  <RepeatIcon />
                </Box>
                <Text textStyle="button" fontSize={{ xl: '18px' }}>
                  Again
                </Text>
              </Flex>
            ) : hasTickets ? (
              // if first play
              <Text textStyle="textSansSmall">
                {isSm ? 'Tap' : 'Double-click'} to activate your Ticket
              </Text>
            ) : (
              <Text textStyle="textSansSmall">You need a Ticket to&nbsp;start</Text>
            )}
          </>
        ) : null}

        {[TicketStates.TicketPlaced, TicketStates.TicketBurnLoading].includes(state) ? (
          <img className="momento_ticket_image" src={TicketImage} alt="Ticket" />
        ) : null}

        {isActiveImage ? (
          <img className="momento_ticket_image active" src={TicketActiveImage} alt="Ticket" />
        ) : null}
      </Flex>

      <Text
        position="absolute"
        bottom={{ sm: '20px', lg: '0' }}
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
