import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useTicketContract } from './contracts/useTicketContract';

export const TICKET_BALANCE_REQUEST = 'ticket-balance-request';
export const useTicketsBalance = () => {
  const ticketContract = useTicketContract();

  const { address } = useAccount();

  return useQuery(
    [TICKET_BALANCE_REQUEST, { address }],
    async () => {
      return address ? await ticketContract.balanceOf(address) : null;
    },
    {
      select: (data) => data?.toNumber(),
    }
  );
};
