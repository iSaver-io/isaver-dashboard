import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useAccounts } from './admin/useAccounts';
import { useContractsAddresses } from './admin/useContractsAddresses';
import { useTicketContract } from './contracts/useTicketContract';
import { useNotification } from './useNotification';

export const useTickets = () => {
  const ticketContract = useTicketContract();
  const { success, handleError } = useNotification();

  const mintTickets = useMutation(
    ['mint-raffle-tickets'],
    async (props: { address: string; amount: number }) => {
      const txHash = await ticketContract.mintTickets(props);
      success({
        title: 'Success',
        description: `${props.amount} Raffle Tickets has been minted for ${props.address}`,
        txHash,
      });
    },
    { onError: handleError }
  );

  return {
    mintTickets,
  };
};

export const useTicketSupply = () => {
  const ticketContract = useTicketContract();
  const tokenId = 0;

  const { address } = useAccount();
  const accounts = useAccounts();
  const contracts = useContractsAddresses();

  const currentSupply = useQuery(['ticket-total-supply-query'], () =>
    ticketContract.totalSupply(tokenId)
  );

  const totalMinted = useQuery(
    ['ticket-total-minted'],
    () => ticketContract.getAllMintTransfers(),
    {
      select: (data) =>
        data.reduce((acc, transfer) => {
          acc += transfer.args.value.toNumber();
          return acc;
        }, 0),
    }
  );

  const uniqueAddresses = useMemo(() => {
    return Array.from(new Set([...Object.values(accounts), ...Object.values(contracts)]));
  }, [accounts, contracts]);

  const balance = useQuery(
    ['ticket-circulating-supply', address],
    async () => {
      return address ? await ticketContract.balanceOf(address) : null;
    },
    {
      select: (data) => data?.toNumber(),
    }
  );

  const balances = useQueries({
    queries: uniqueAddresses.map((address) => ({
      queryKey: ['ticket-circulating-supply', address],
      queryFn: () => ticketContract.balanceOf(address, tokenId),
    })),
  });

  const totalBurned = useMemo(() => {
    if (totalMinted.data === undefined || currentSupply.data === undefined) return undefined;
    return totalMinted.data - currentSupply.data?.toNumber();
  }, [totalMinted.data, currentSupply.data]);

  const circulatingSupply = useMemo(() => {
    if (!currentSupply.data) return 0;
    return balances
      .reduce((sum, balanceRequest) => {
        if (balanceRequest.data) return sum.sub(balanceRequest.data);
        return sum;
      }, currentSupply.data)
      .toNumber();
  }, [currentSupply.data, balances]);

  return {
    totalSupply: totalMinted.data,
    totalBurned,
    circulatingSupply,
    balance,
  };
};
