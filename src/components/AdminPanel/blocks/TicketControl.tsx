import { Box, useDisclosure } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { ControlField } from '@/components/AdminPanel/common/ControlField';
import { MintRaffleTicket } from '@/components/AdminPanel/common/MintRaffleTicket';
import { Balance } from '@/components/Balance/Balance';
import { Button } from '@/components/ui/Button/Button';
import { useRaffleControl, useTicketPrice } from '@/hooks/raffle/useRaffle';
import { useTickets, useTicketSupply } from '@/hooks/useTickets';
import { bigNumberToString } from '@/utils/number';

export const TicketControl = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mintTickets } = useTickets();
  const { updateTicketPrice } = useRaffleControl();
  const { ticketPriceRequest } = useTicketPrice();
  const ticketSupply = useTicketSupply();

  return (
    <AdminSection title="Raffle Ticket">
      <>
        <ControlField
          label="Raffle Ticket price"
          value={ticketPriceRequest.data ? bigNumberToString(ticketPriceRequest.data) : null}
          onSubmit={updateTicketPrice.mutateAsync}
        />

        <Button size="sm" onClick={onOpen}>
          Mint tickets
        </Button>

        <Box mt="24px">
          <Balance label="Total Supply" balance={ticketSupply.totalSupply} minLimit={0} isRaw />
          <Balance
            label="Circulating Supply"
            balance={ticketSupply.circulatingSupply}
            minLimit={0}
            isRaw
          />
          <Balance label="Total Burned" balance={ticketSupply.totalBurned} minLimit={0} isRaw />
        </Box>

        {isOpen ? <MintRaffleTicket onClose={onClose} onSubmit={mintTickets.mutateAsync} /> : null}
      </>
    </AdminSection>
  );
};
