import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAccessControlContract } from '../contracts/useAccessControlContract';
import { ContractsEnum } from '../contracts/useContractAbi';
import { useNotification } from '../useNotification';

const CONTRACT_ADMINS_REQUEST = 'contract-admins-request';
export const useAccessControl = (contractName: ContractsEnum) => {
  const contractAccessControl = useAccessControlContract(contractName);
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  const adminsRequest = useQuery([CONTRACT_ADMINS_REQUEST, contractName], () =>
    contractAccessControl.getAdmins()
  );

  const grantAdminRole = useMutation(
    ['grant-admin-role', contractName],
    async (account: string) => {
      const txHash = await contractAccessControl.grantAdminRole(account);
      success({
        title: 'Success',
        description: `Admin role granted to ${account}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [CONTRACT_ADMINS_REQUEST, contractName] });
      },
      onError: (err) => handleError(err),
    }
  );
  const revokeAdminRole = useMutation(
    ['revoke-admin-role', contractName],
    async (account: string) => {
      const txHash = await contractAccessControl.revokeAdminRole(account);
      success({
        title: 'Success',
        description: `Admin role revoked from ${account}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [CONTRACT_ADMINS_REQUEST, contractName] });
      },
      onError: (err) => handleError(err),
    }
  );

  return {
    adminsRequest,
    grantAdminRole,
    revokeAdminRole,
  };
};
