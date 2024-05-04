import { Interface } from '@ethersproject/abi';
import { Address, useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK } from '@/constants';
import alchemy from '@/modules/alchemy';
import { AccessControlUpgradeable } from '@/types';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useAccessControlContract = (contractName: ContractsEnum) => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: contractName,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as AccessControlUpgradeable;

  const contractIface = new Interface(abi);

  const getUsersWithRole = async (requiredRole: string) => {
    const filterGranted = contract.filters.RoleGranted();
    const filterRevoked = contract.filters.RoleRevoked();

    const rawEventsGranted = await alchemy.core.getLogs({
      ...filterGranted,
      fromBlock: FROM_BLOCK,
      toBlock: 'latest',
    });
    const rawEventsRevoked = await alchemy.core.getLogs({
      ...filterRevoked,
      fromBlock: FROM_BLOCK,
      toBlock: 'latest',
    });

    const rawEvents = rawEventsGranted
      .concat(rawEventsRevoked)
      .sort((a, b) => a.blockNumber - b.blockNumber);

    const events = rawEvents.map((event) => ({ ...event, ...contractIface.parseLog(event) }));

    const activeAdmins = new Set();

    for (const event of events) {
      const { role, account } = event.args;

      const hasRole = role === requiredRole;
      const isApproved = event.name === 'RoleGranted';

      if (hasRole) {
        if (isApproved) {
          activeAdmins.add(account);
        } else {
          activeAdmins.delete(account);
        }
      }
    }

    return Array.from(activeAdmins) as Address[];
  };

  const grantRole = async (account: string, role: string) => {
    const tx = await contract.grantRole(role, account);
    return waitForTransaction(tx);
  };
  const revokeRole = async (account: string, role: string) => {
    const tx = await contract.revokeRole(role, account);
    return waitForTransaction(tx);
  };

  return {
    contract,
    getUsersWithRole,

    grantRole,
    revokeRole,
  };
};
