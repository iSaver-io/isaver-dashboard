import { useMutation } from '@tanstack/react-query';

import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useTokenContract } from '@/hooks/contracts/useTokenContract';
import { useNotification } from '@/hooks/useNotification';

export const useTokenControl = (token: ContractsEnum.SAVR) => {
  const contract = useTokenContract(token);

  const { success, handleError } = useNotification();

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
      onError: (err) => handleError(err),
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
      onError: (err) => handleError(err),
    }
  );

  return {
    contract,
    addToWhiteList,
    removeFromWhiteList,
  };
};
