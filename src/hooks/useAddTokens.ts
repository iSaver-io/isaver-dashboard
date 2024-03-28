import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import { ContractsEnum, useContractAbi } from './contracts/useContractAbi';
import { useNotification } from './useNotification';

export const useAddTokens = () => {
  const { address: savAddress } = useContractAbi({ contract: ContractsEnum.SAV });
  const { address: savrAddress } = useContractAbi({ contract: ContractsEnum.SAVR });
  const { success, handleError } = useNotification();

  const signer = useAccount();

  const addToWallet = useCallback(
    async (tokenName: string) => {
      const TOKEN_PARAMS: Record<string, any> = {
        SAV: {
          address: savAddress,
          symbol: 'SAV',
          decimals: 18,
          image: `${window.origin}/sav.png`,
        },
        SAVR: {
          address: savrAddress,
          symbol: 'SAVR',
          decimals: 18,
          image: `${window.origin}/savr.png`,
        },
      };

      try {
        const tokenParams = TOKEN_PARAMS[tokenName];

        if (!tokenParams) return;

        const wasAdded =
          signer.connector &&
          signer.connector.watchAsset &&
          (await signer.connector.watchAsset({
            address: tokenParams.address,
            symbol: tokenParams.symbol,
            decimals: tokenParams.decimals,
            image: tokenParams.image,
          }));
        if (wasAdded) {
          success({ title: 'Token added' });
        }
      } catch (err) {
        handleError(err);
      }
    },
    [savAddress, savrAddress, success, handleError, signer]
  );

  const addSAV = () => addToWallet('SAV');
  const addSAVR = () => addToWallet('SAVR');

  return { addSAV, addSAVR };
};
