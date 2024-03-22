import { useCallback, useMemo } from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import { ReactComponent as RepeatIcon } from '@/assets/images/icons/repeat.svg';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useMomento } from '@/hooks/useMomento';
import { useTicketsBalance } from '@/hooks/useTicketsBalance';

import TicketImage from './images/ticket.png';
import TicketActiveImage from './images/ticket-active.png';
import TicketEmpty from './images/ticket-empty.png';
import TicketEmptyBorder from './images/ticket-empty-border.png';

interface TicketProps {
  tip: string;
  isActive: boolean;
  setActive: (active: boolean) => void;
}

const images = [TicketImage, TicketActiveImage, TicketEmpty, TicketEmptyBorder];
export const Ticket = ({ tip, isActive, setActive }: TicketProps) => {
  const balance = useTicketsBalance();
  const { hasPendingRequest, isOracleResponseReady } = useMomento();
  const bp = useBreakpoint({ ssr: false });

  const isReplay = useMemo(() => !isActive && tip, [isActive, tip]);
  const isSm = useMemo(() => ['sm', 'md', 'lg'].includes(bp), [bp]);

  const handleClick = useCallback(
    (event: any) => {
      if (event.detail === 2 || ((isSm || isReplay) && event.detail === 1)) {
        setActive(true);
      }
    },
    [isReplay, isSm, setActive]
  );

  useImagePreloader(images);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      mt={{ sm: '30px' }}
      mb={!tip ? { base: '30px', lg: '0' } : undefined}
    >
      <Flex
        className="momento_ticket"
        justifyContent="center"
        alignItems="center"
        px="55px"
        cursor={balance.data && !isActive ? 'pointer' : undefined}
        onClick={balance.data && !isActive ? handleClick : undefined}
      >
        {hasPendingRequest || isOracleResponseReady ? (
          <img className="momento_ticket_image active" src={TicketActiveImage} alt="Ticket" />
        ) : isActive ? (
          <img className="momento_ticket_image" src={TicketImage} alt="Ticket" />
        ) : (
          <>
            <img
              className="momento_ticket_image"
              src={balance.data ? TicketEmptyBorder : TicketEmpty}
              alt="Ticket"
            />
            {balance.data ? (
              isReplay ? (
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
                  {isSm ? 'Click' : 'Double-click'} to activate your Ticket
                </Text>
              )
            ) : (
              <Text textStyle="textSansSmall">You need a Ticket to&nbsp;start</Text>
            )}
          </>
        )}
      </Flex>

      <Text
        display={{ sm: tip ? 'unset' : 'none', lg: 'unset' }}
        mt={{ sm: '20px', xl: '25px' }}
        mb={{ base: '20px', lg: '0' }}
        height={{ sm: '18px', xl: '24px' }}
        fontSize={{ sm: '12px', xl: '16px' }}
        fontWeight={{ xl: '500' }}
      >
        {tip || ''}
      </Text>
    </Flex>
  );
};
