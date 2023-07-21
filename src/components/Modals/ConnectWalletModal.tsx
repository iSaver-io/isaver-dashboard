import { FC, useCallback, useEffect } from 'react';
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useAccount, useConnect } from 'wagmi';

import { ReactComponent as MetamaskIcon } from '@/assets/images/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from '@/assets/images/icons/walletconnect.svg';
import { Button } from '@/components/ui/Button/Button';
import { useLogger } from '@/hooks/useLogger';
import { metamaskConnector, walletConnector } from '@/modules/wagmi';

type ConnectWalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ConnectWalletModal: FC<ConnectWalletModalProps> = ({ onClose, isOpen }) => {
  const {
    connect,
    error: connectError,
    isLoading: isConnectLoading,
    pendingConnector,
  } = useConnect();
  const logger = useLogger({
    event: 'cross',
    category: 'elements',
    action: 'button_click',
    buttonLocation: 'popup',
    actionGroup: 'interactions',
  });

  const { isConnected } = useAccount();

  //   Close modal on connection
  useEffect(() => {
    if (isConnected && isOpen) onClose();
  }, [isConnected, onClose, isOpen]);

  const handleConnect = useCallback(
    async (connector: any) => {
      connect({ connector });
      logger({ label: connector.name });
    },
    [connect, logger]
  );

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="center">
          <Text textStyle="textBold">Connect Wallet</Text>
          <ModalCloseButton onClick={onClose} size="lg" right="20px" top="20px" />
        </ModalHeader>
        <ModalBody>
          {connectError ? (
            <Text color="error" textAlign="center" textStyle="textBold">
              {connectError.message}
            </Text>
          ) : null}
          <ConnectButton
            text={metamaskConnector.name}
            icon={<MetamaskIcon />}
            onClick={() => handleConnect(metamaskConnector)}
            isLoading={isConnectLoading && pendingConnector?.id === metamaskConnector.id}
          />
          <ConnectButton
            text="WalletConnectV2"
            icon={<WalletConnectIcon />}
            onClick={() => handleConnect(walletConnector)}
            isLoading={isConnectLoading && pendingConnector?.id === walletConnector.id}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type ConnectButtonProps = {
  text: string;
  icon: any;
  isLoading?: boolean;
  onClick: () => void;
};
const ConnectButton: FC<ConnectButtonProps> = ({ text, icon, onClick, isLoading }) => {
  return (
    <Button
      background="linear-gradient(96.85deg, rgba(35, 157, 113, 0.54) -8.44%, rgba(35, 54, 72, 0.54) 102.66%)"
      boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      w="100%"
      mt="10px"
      p="20px"
      size="xl"
      onClick={onClick}
      isLoading={isLoading}
      textTransform="none"
    >
      <Flex justifyContent="space-between" alignItems="center" w="100%">
        {icon}
        {text}
      </Flex>
    </Button>
  );
};
