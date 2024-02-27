import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useTicketContract } from './contracts/useTicketContract';

export const useTicketsBalance = () => {
  const ticketContract = useTicketContract();

  const { address } = useAccount();

  return useQuery(
    ['ticket-circulating-supply', address],
    async () => {
      return address ? await ticketContract.balanceOf(address) : null;
    },
    {
      select: (data) => data?.toNumber(),
    }
  );
};
