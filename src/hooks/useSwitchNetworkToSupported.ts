import { useEffect, useRef } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

import { useNotification } from './useNotification';

export const useSwitchNetworkToSupported = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { error, success } = useNotification();

  const { chains, error: chainSwitchError, switchNetworkAsync } = useSwitchNetwork();

  const isSwitchTried = useRef(false);

  //   Switch network if it is unsupported
  useEffect(() => {
    const handleSwitch = async () => {
      if (isConnected && chain?.unsupported) {
        error({ title: 'Unsupported network' });
        isSwitchTried.current = true;
        if (switchNetworkAsync) {
          await switchNetworkAsync(chains[0].id);
          success({ title: `Network changed to ${chains[0].name}` });
        }
      }
    };

    if (!isSwitchTried.current) {
      handleSwitch();
    }
  }, [isConnected, error, chain, chains, success, switchNetworkAsync]);

  useEffect(() => {
    if (chainSwitchError) {
      error({ title: 'Failed', description: chainSwitchError.message });
    }
  }, [chainSwitchError, error]);
};
