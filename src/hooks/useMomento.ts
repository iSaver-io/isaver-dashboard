import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useTicketContract } from '@/hooks/contracts/useTicketContract';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useNotification } from '@/hooks/useNotification';

import { useMomentoContract } from './contracts/useMomentoContract';

const TICKET_BURNED_MUTATION = 'ticket-burned-mutation';
const ORACLE_RESPONSE_MUTATION = 'oracle-response-mutation';
const BURN_TICKET = 'burn-ticket-mutation';
const GET_PRIZE_MUTATION = 'get-prize-mutation';

export const useMomento = () => {
  const { address } = useAccount();
  const momentoContract = useMomentoContract();
  const ticketContract = useTicketContract();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  const { data: isTicketBurned } = useQuery([TICKET_BURNED_MUTATION, { address }], async () =>
    address ? await momentoContract.isTicketBurned(address) : null
  );

  const { data: isOracleResponseReady } = useQuery(
    [ORACLE_RESPONSE_MUTATION, { address }],
    async () => (address ? await momentoContract.isOracleResponseReady(address) : null)
  );

  const burnTicket = useMutation(
    [BURN_TICKET],
    async () => {
      if (!address) {
        connect();
        return;
      }
      const isApproved = await ticketContract.isApprovedForAll(address, momentoContract.address);
      if (!isApproved) {
        const approveTx = await ticketContract.setApprovalForAll(momentoContract.address, true);
        success({ title: 'Approved', txHash: approveTx });
      }

      const txHash = await momentoContract.burnTicket();
      success({
        title: 'Success',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([TICKET_BURNED_MUTATION, { address }]);
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const getPrize = useMutation(
    [GET_PRIZE_MUTATION],
    async () => {
      if (!address) {
        connect();
        return;
      }

      const txHash = await momentoContract.getPrize();
      success({
        title: 'Success',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([TICKET_BURNED_MUTATION, { address }]);
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    isOracleResponseReady,
    isTicketBurned,
    burnTicket,
    getPrize,
  };
};
