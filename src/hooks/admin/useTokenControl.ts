import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useTokenContract } from '@/hooks/contracts/useTokenContract';
import { useNotification } from '@/hooks/useNotification';

const IS_PAUSED = 'is-paused';

export const useTokenControl = (token: ContractsEnum.SAV | ContractsEnum.SAVR) => {
  const queryClient = useQueryClient();
  const contract = useTokenContract(token);

  const { success, handleError } = useNotification();

  const isPaused = useQuery([IS_PAUSED, token], () => contract.paused());

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

  const addToBlackList = useMutation(
    ['add-to-blacklist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.addToBlackList(addresses);
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

  const removeFromBlackList = useMutation(
    ['remove-from-blacklist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.removeFromBlackList(addresses);
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

  const addToWhiteList = useMutation(
    ['add-to-whitelist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.addToWhiteList(addresses);
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

  const removeFromWhiteList = useMutation(
    ['remove-from-whitelist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.removeFromWhiteList(addresses);
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
    pause,
    unpause,
    addToBlackList,
    removeFromBlackList,
    addToWhiteList,
    removeFromWhiteList,
  };
};
