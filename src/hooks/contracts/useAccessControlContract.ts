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

  const getAdmins = async () => {
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

    const adminRole = await contract.DEFAULT_ADMIN_ROLE();

    const rawEvents = rawEventsGranted
      .concat(rawEventsRevoked)
      .sort((a, b) => a.blockNumber - b.blockNumber);

    const events = rawEvents.map((event) => ({ ...event, ...contractIface.parseLog(event) }));

    const activeAdmins = new Set();

    for (const event of events) {
      const { role, account } = event.args;

      const isAdminRole = role === adminRole;
      const isApproved = event.name === 'RoleGranted';

      if (isAdminRole) {
        if (isApproved) {
          activeAdmins.add(account);
        } else {
          activeAdmins.delete(account);
        }
      }
    }

    return Array.from(activeAdmins) as Address[];
  };

  const grantAdminRole = async (account: string) => {
    const adminRole = await contract.DEFAULT_ADMIN_ROLE();
    const tx = await contract.grantRole(adminRole, account);
    return waitForTransaction(tx);
  };
  const revokeAdminRole = async (account: string) => {
    const adminRole = await contract.DEFAULT_ADMIN_ROLE();
    const tx = await contract.revokeRole(adminRole, account);
    return waitForTransaction(tx);
  };

  return {
    contract,
    getAdmins,

    grantAdminRole,
    revokeAdminRole,
  };
};
