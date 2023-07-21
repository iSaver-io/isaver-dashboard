import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useTokenContract } from '@/hooks/contracts/useTokenContract';
import { useNotification } from '@/hooks/useNotification';

const IS_PAUSED = 'is-paused';
const IS_WHITELISTED = 'is-whitelisted';

export const useTokenControl = (token: ContractsEnum.SAV | ContractsEnum.SAVR) => {
  const queryClient = useQueryClient();
  const contract = useTokenContract(token);

  const { success, handleError } = useNotification();

  const isPaused = useQuery([IS_PAUSED, token], () => contract.paused());
  const isWhitelistRestrictionMode = useQuery([IS_WHITELISTED, token], () =>
    contract.isWhitelistRestrictionMode()
  );

  const pause = useMutation(
    ['pause-token-mutation'],
    async () => {
      const txHash = await contract.pause();
      success({
        title: 'Success',
        description: `${token === ContractsEnum.SAV ? 'SAV' : 'SAVR'} token has been paused`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([IS_PAUSED, token]);
      },
      onError: handleError,
    }
  );

  const unpause = useMutation(
    ['unpause-token-mutation'],
    async () => {
      const txHash = await contract.unpause();
      success({
        title: 'Success',
        description: `${token === ContractsEnum.SAV ? 'SAV' : 'SAVR'} token has been unpaused`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([IS_PAUSED, token]);
      },
      onError: handleError,
    }
  );

  const enableWhitelistMode = useMutation(
    ['enable-whitelist-mode-mutation'],
    async () => {
      const txHash = await contract.enableWhitelistMode();
      success({
        title: 'Success',
        description: `${
          token === ContractsEnum.SAV ? 'SAV' : 'SAVR'
        } token has been turned to Whitelist mode`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([IS_WHITELISTED, token]);
      },
      onError: handleError,
    }
  );

  const disableWhitelistMode = useMutation(
    ['disable-whitelist-mode-mutation'],
    async () => {
      const txHash = await contract.disableWhitelistMode();
      success({
        title: 'Success',
        description: `${
          token === ContractsEnum.SAV ? 'SAV' : 'SAVR'
        } token has been turned to Blacklist mode`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([IS_WHITELISTED, token]);
      },
      onError: handleError,
    }
  );

  const addToBlacklist = useMutation(
    ['add-to-blacklist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.addToBlacklist(addresses);
      success({
        title: 'Success',
        description: `${addresses.join(', ')} addresses added to blacklist`,
        txHash,
      });
    },
    {
      onError: handleError,
    }
  );

  const removeFromBlacklist = useMutation(
    ['remove-from-blacklist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.removeFromBlacklist(addresses);
      success({
        title: 'Success',
        description: `${addresses.join(', ')} addresses removed from blacklist`,
        txHash,
      });
    },
    {
      onError: handleError,
    }
  );

  const addToWhitelist = useMutation(
    ['add-to-whitelist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.addToWhitelist(addresses);
      success({
        title: 'Success',
        description: `${addresses.join(', ')} addresses added to whitelist`,
        txHash,
      });
    },
    {
      onError: handleError,
    }
  );

  const removeFromWhitelist = useMutation(
    ['remove-from-whitelist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.removeFromWhitelist(addresses);
      success({
        title: 'Success',
        description: `${addresses.join(', ')} addresses removed from whitelist`,
        txHash,
      });
    },
    {
      onError: handleError,
    }
  );

  return {
    contract,
    isPaused,
    isWhitelistRestrictionMode,
    pause,
    unpause,
    addToBlacklist,
    removeFromBlacklist,
    addToWhitelist,
    removeFromWhitelist,
    enableWhitelistMode,
    disableWhitelistMode,
  };
};
