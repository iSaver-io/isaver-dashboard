import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { utils } from 'ethers';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';

import { AccessControl } from '@/types.common';

import { useAccessControlContract } from '../contracts/useAccessControlContract';
import { ContractsEnum, useContractAbi } from '../contracts/useContractAbi';
import { useNotification } from '../useNotification';

const USERS_WITH_ROLE = 'users-with-role-request';
const HAS_ROLE_REQUEST = 'has-role-request';

type Role = 'admin' | 'operator' | 'minter';

const ROLES: Record<Role, string> = {
  admin: '0x0000000000000000000000000000000000000000000000000000000000000000',
  operator: utils.keccak256(utils.toUtf8Bytes('OPERATOR_ROLE')),
  minter: utils.keccak256(utils.toUtf8Bytes('MINTER_ROLE')),
};

export const useHasRole = (
  contractName: Exclude<ContractsEnum, ContractsEnum.Helper>,
  requiredRole: Role = 'admin'
) => {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: contractName,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as AccessControl;

  const role = ROLES[requiredRole];

  return useQuery(
    [HAS_ROLE_REQUEST, { contractName, address, role }],
    () => contract && address && contract.hasRole(role, address),
    {
      enabled: isConnected,
    }
  );
};

export const useAccessControl = (contractName: ContractsEnum, role: Role) => {
  const contractAccessControl = useAccessControlContract(contractName);
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  const usersWithRoleRequest = useQuery([USERS_WITH_ROLE, contractName, role], () =>
    contractAccessControl.getUsersWithRole(ROLES[role])
  );

  const grantRole = useMutation(
    ['grant-role', contractName],
    async (account: string) => {
      const txHash = await contractAccessControl.grantRole(account, ROLES[role]);
      success({
        title: 'Success',
        description: `Admin role granted to ${account}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USERS_WITH_ROLE, contractName, role] });
      },
      onError: (err) => handleError(err),
    }
  );
  const revokeRole = useMutation(
    ['revoke-role', contractName],
    async (account: string) => {
      const txHash = await contractAccessControl.revokeRole(account, ROLES[role]);
      success({
        title: 'Success',
        description: `Admin role revoked from ${account}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USERS_WITH_ROLE, contractName, role] });
      },
      onError: (err) => handleError(err),
    }
  );

  return {
    usersWithRoleRequest,
    grantRole,
    revokeRole,
  };
};
