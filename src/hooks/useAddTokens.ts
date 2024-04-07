import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import { ContractsEnum, useContractAbi } from './contracts/useContractAbi';
import { useNotification } from './useNotification';

export const useAddTokens = () => {
  const { address: savAddress } = useContractAbi({ contract: ContractsEnum.SAV });
  const { address: savrAddress } = useContractAbi({ contract: ContractsEnum.SAVR });
  const { success, error } = useNotification();

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

      const tokenParams = TOKEN_PARAMS[tokenName];
      if (!tokenParams) return;

      let wasAdded: boolean | undefined = false;
      try {
        wasAdded = await window.ethereum?.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenParams.address,
              symbol: tokenParams.symbol,
              decimals: tokenParams.decimals,
              image: tokenParams.image,
            },
          },
        });
      } catch (err) {
        console.error(err);
      }

      if (!wasAdded) {
        try {
          wasAdded =
            signer.connector &&
            signer.connector.watchAsset &&
            (await signer.connector.watchAsset({
              address: tokenParams.address,
              symbol: tokenParams.symbol,
              decimals: tokenParams.decimals,
              image: tokenParams.image,
            }));
        } catch (err) {
          console.error(err);
        }
      }

      if (wasAdded) {
        success({ title: 'Token added' });
      } else {
        error({ title: 'Failed to add to token' });
      }
    },
    [savAddress, savrAddress, success, error, signer]
  );

  const addSAV = () => addToWallet('SAV');
  const addSAVR = () => addToWallet('SAVR');

  return { addSAV, addSAVR };
};
