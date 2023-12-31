import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, CloseButton, Flex, Link, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useExplorerLink } from '@/hooks/useExplorerLink';
import { useLogger } from '@/hooks/useLogger';

export type NotificationProps = {
  type: 'success' | 'error' | 'info';
  title: string;
  description?: any;
  txHash?: string;
  onClose: () => void;
};
export const Notification: FC<NotificationProps> = ({
  type,
  title,
  description,
  txHash,
  onClose,
}) => {
  const { isConnected } = useAccount();
  const [isAuth, setIsAuth] = useState(false);
  const logger = useLogger({
    event: 'cross',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'popup',
    actionGroup: 'interactions',
  });

  useEffect(() => {
    if (!isConnected && isAuth) {
      onClose();
    }
    setIsAuth(isConnected);
  }, [isConnected, onClose, isAuth]);

  const textColor = useMemo(() => {
    if (type === 'error') return 'error';
    return 'white';
  }, [type]);
  const borderColor = useMemo(() => {
    if (type === 'error') return 'error';
    return 'green.400';
  }, [type]);

  const scanLink = useExplorerLink(txHash);

  const handleClose = useCallback(() => {
    logger({ label: 'close' });
    onClose();
  }, [logger, onClose]);

  const logExlporerClick = useCallback(() => {
    logger({ category: 'notifications', action: 'link_click', label: 'polygonscan' });
  }, [logger]);

  return (
    <Box
      bgColor="bgGreen.200"
      borderRadius="13px"
      p="20px 20px 20px 30px"
      width={{ sm: '300px', md: '380px' }}
      borderLeft="10px solid"
      borderColor={borderColor}
    >
      <Flex justifyContent="space-between">
        <Text textStyle="textSansBold" fontSize="24px" color="white">
          {title}
        </Text>
        <CloseButton onClick={handleClose} />
      </Flex>
      {description ? (
        <Box textStyle="text1" mt="10px" color={textColor}>
          {description}
        </Box>
      ) : null}
      {txHash && scanLink ? (
        <Link
          href={scanLink}
          target="_blank"
          color="green.400"
          display="block"
          mt="10px"
          onClick={logExlporerClick}
        >
          View on Polygonscan
        </Link>
      ) : null}
    </Box>
  );
};
