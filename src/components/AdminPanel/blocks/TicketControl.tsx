import { Box, useDisclosure } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { ControlField } from '@/components/AdminPanel/common/ControlField';
import { MintRaffleTicket } from '@/components/AdminPanel/common/MintRaffleTicket';
import { Balance } from '@/components/Balance/Balance';
import { Button } from '@/components/ui/Button/Button';
import { useRaffleControl, useTicketPrice } from '@/hooks/raffle/useRaffle';
import { useRaffleMiniGame } from '@/hooks/raffle/useRaffleMiniGame';
import { useMomentoControl } from '@/hooks/useMomento';
import { useTickets, useTicketSupply } from '@/hooks/useTickets';
import { bigNumberToString } from '@/utils/number';

export const TicketControl = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mintTickets } = useTickets();
  const {
    updateTicketPrice,
    updateExtraTicketsForPowerD,
    totalBurnedTickets: raffleTotalBurnedTickets,
  } = useRaffleControl();
  const { ticketPriceRequest } = useTicketPrice();
  const { extraTicketsPowerD } = useRaffleMiniGame();
  const ticketSupply = useTicketSupply();

  const {
    totalBurnedTicketsRequest: { data: momentoTotalBurned },
  } = useMomentoControl();

  return (
    <AdminSection title="Raffle Ticket">
      <>
        <ControlField
          label="Raffle Ticket price"
          value={ticketPriceRequest.data ? bigNumberToString(ticketPriceRequest.data) : null}
          onSubmit={updateTicketPrice.mutateAsync}
        />

        <ControlField
          label="Extra tickets for Power D"
          value={extraTicketsPowerD.data ? extraTicketsPowerD.data : 0}
          onSubmit={updateExtraTicketsForPowerD.mutateAsync}
        />

        <Button size="sm" onClick={onOpen}>
          Mint tickets
        </Button>

        <Box mt="24px">
          <Balance
            label="Total Supply"
            // Прибавляем supply первой версии билета + 13243
            balance={ticketSupply.totalSupply ? ticketSupply.totalSupply + 11588 : undefined}
            minLimit={0}
            isRaw
          />
          <Balance
            label="Circulating Supply"
            balance={ticketSupply.circulatingSupply}
            minLimit={0}
            isRaw
          />
          <Balance label="Project Supply" balance={ticketSupply.projectSupply} minLimit={0} isRaw />
          <Balance
            label="Total Burned"
            // Прибавляем burned первой версии билета
            balance={ticketSupply.totalBurned ? ticketSupply.totalBurned + 11588 : undefined}
            minLimit={0}
            isRaw
          />

          <Balance
            label="Total burned Raffle"
            balance={raffleTotalBurnedTickets}
            minLimit={0}
            isRaw
          />
          <Balance label="Total burned Momento" balance={momentoTotalBurned} minLimit={0} isRaw />
        </Box>

        {isOpen ? <MintRaffleTicket onClose={onClose} onSubmit={mintTickets.mutateAsync} /> : null}
      </>
    </AdminSection>
  );
};
