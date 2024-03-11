import { Flex, Text } from '@chakra-ui/react';

import { useMomento } from '@/hooks/useMomento';
import { useTicketsBalance } from '@/hooks/useTicketsBalance';

import TicketImage from './images/ticket.png';
import TicketActiveImage from './images/ticket-active.png';
import TicketEmpty from './images/ticket-empty.png';
import TicketEmptyBorder from './images/ticket-empty-border.png';

interface TicketProps {
  isActive: boolean;
  setActive: (active: boolean) => void;
}

export const Ticket = ({ isActive, setActive }: TicketProps) => {
  const balance = useTicketsBalance();
  const { hasPendingRequest, isOracleResponseReady } = useMomento();

  const handleClick = (event: any) => {
    if (event.detail === 2) {
      setActive(true);
    }
  };

  if (hasPendingRequest || isOracleResponseReady || isActive)
    return (
      <Flex className="momento_ticket" justifyContent="center" alignItems="center" px="40px">
        {hasPendingRequest || isOracleResponseReady ? (
          <img className="momento_ticket_image" src={TicketActiveImage} alt="Ticket" />
        ) : (
          <img className="momento_ticket_image" src={TicketImage} alt="Ticket" />
        )}
      </Flex>
    );

  return (
    <Flex
      className="momento_ticket"
      justifyContent="center"
      alignItems="center"
      px="40px"
      cursor={balance.data ? 'pointer' : undefined}
      onClick={balance.data ? handleClick : undefined}
    >
      <img
        className="momento_ticket_image"
        src={balance.data ? TicketEmptyBorder : TicketEmpty}
        alt="Ticket"
      />
      <Text textStyle="text1">
        {balance.data ? 'Double-click to activate your Ticket' : 'You need a Ticket to start'}
      </Text>
    </Flex>
  );
};
