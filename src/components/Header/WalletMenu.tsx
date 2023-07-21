import { FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useBreakpoint,
  useClipboard,
} from '@chakra-ui/react';

import { ReactComponent as ChevronDownIcon } from '@/assets/images/icons/chevron-down.svg';
import { ReactComponent as MetamaskIcon } from '@/assets/images/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from '@/assets/images/icons/walletconnect.svg';
import { useLogger } from '@/hooks/useLogger';
import { useNotification } from '@/hooks/useNotification';
import { trimAddress } from '@/utils/address';
import { isSafari } from '@/utils/browser';

const CONNECTOR_ICON: Record<string, any> = {
  MetaMask: <MetamaskIcon />,
  WalletConnect: <WalletConnectIcon />,
};

type Props = {
  address?: string;
  connector?: any;
  disconnect: () => void;
};

const focusStyle = { bgColor: 'green.400' };
const menuItemStyle = {
  textAlign: 'right' as const,
  display: 'block',
  borderRadius: 'sm',
  bgColor: 'transparent',
  _hover: focusStyle,
  _focus: focusStyle,
  _active: focusStyle,
};

export const WalletMenu: FC<Props> = ({ connector, disconnect, address }) => {
  const connectorIcon = connector ? CONNECTOR_ICON[connector.name] : undefined;
  const { onCopy, setValue, hasCopied } = useClipboard(address || '');
  const { success } = useNotification();
  const logger = useLogger({
    event: 'cross',
    category: 'elements',
    buttonLocation: 'header',
    actionGroup: 'interactions',
  });

  const [iconDisplay, setIconDisplay] = useState('unset');

  useEffect(() => {
    // hack for rerendering icon in Safari
    if (isSafari() && connector && connector.name === 'WalletConnect') {
      setIconDisplay('none');
      setTimeout(() => {
        setIconDisplay('initial');
      }, 300);
    } else {
      setIconDisplay('initial');
    }
  }, [connector]);

  useEffect(() => {
    if (hasCopied) {
      success({ title: 'Copied!' });
    }
  }, [hasCopied, success]);

  useEffect(() => {
    setValue(address || '');
  }, [setValue, address]);

  const logWalletMenuClick = useCallback(() => {
    logger({ action: 'button_click', label: 'activ_wallet' });
  }, [logger]);

  const handleCopy = useCallback(() => {
    onCopy();
    logger({ action: 'wallet_click', label: 'copy' });
  }, [logger, onCopy]);

  const handleDisconnect = useCallback(() => {
    logger({ action: 'wallet_click', label: 'disconnect' });
    disconnect();
  }, [logger, disconnect]);

  const bp = useBreakpoint({ ssr: false });
  const isFullView = bp === '2xl' || bp === 'xl';

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={isFullView ? <ChevronDownIcon /> : undefined}
        size={{ sm: 'md', '2xl': 'lg' }}
        padding={{ sm: '10px', xl: '20px' }}
        textTransform="unset"
        onClick={logWalletMenuClick}
      >
        {isFullView ? (
          <Flex>
            <Box mr="3" width="20px">
              <Box display={iconDisplay}>{connectorIcon}</Box>
            </Box>
            {trimAddress(address, 4, false)}
          </Flex>
        ) : (
          connectorIcon
        )}
      </MenuButton>
      <Portal>
        <MenuList bgColor="green.100" minWidth="150px" p="6px 8px" zIndex="60">
          <MenuItem {...menuItemStyle} onClick={handleCopy} closeOnSelect={false}>
            {hasCopied ? 'Copied' : 'Copy address'}
          </MenuItem>
          <MenuItem {...menuItemStyle} onClick={handleDisconnect}>
            Log out
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
