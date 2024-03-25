import { useCallback } from 'react';
import { ButtonProps, IconButton } from '@chakra-ui/react';

import { ReactComponent as WalletIcon } from '@/assets/images/icons/wallet_filled.svg';
import { Button } from '@/components/ui/Button/Button';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useLogger } from '@/hooks/useLogger';

type ConnectWalletButtonProps = {
  isSmall?: boolean;
  location?: 'header' | 'up' | 'mid' | 'down';
  event?: 'cross' | 'dashboard' | 'team';
  content?: string;
};
export const ConnectWalletButton = ({
  isSmall,
  location,
  content,
  event = 'dashboard',
  ...props
}: ButtonProps & ConnectWalletButtonProps) => {
  const { connect } = useConnectWallet();
  const logger = useLogger({
    category: 'elements',
    event: 'cross',
    action: 'button_click',
    label: 'connect_wallet',
    actionGroup: 'interactions',
  });

  const handleConnectWalletClick = useCallback(() => {
    if (location) {
      logger({ event, buttonLocation: location, content });
    }

    connect();
  }, [logger, connect, location, event, content]);

  if (isSmall) {
    return (
      <IconButton
        {...props}
        aria-label="Connect wallet"
        icon={<WalletIcon width="20px" />}
        padding={{ sm: '0' }}
        onClick={handleConnectWalletClick}
      />
    );
  }

  return (
    <Button {...props} onClick={handleConnectWalletClick}>
      Connect wallet
    </Button>
  );
};
