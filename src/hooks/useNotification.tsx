import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

import { Notification, NotificationProps } from '@/components/ui/Notification/Notification';
import { tryToGetErrorData } from '@/utils/error';

import { useLogger } from './useLogger';

const commonProps = {
  position: 'bottom-left' as const,
  isClosable: true,
  duration: 30000,
};
type ToastProps = Omit<NotificationProps, 'type' | 'onClose'>;

export const useNotification = () => {
  const toast = useToast();
  const logger = useLogger({
    event: 'cross',
    category: 'notifications',
    action: 'notification_show',
    actionGroup: 'callbacks',
  });

  const success = useCallback(
    (props: ToastProps) => {
      toast({
        ...commonProps,
        render: ({ onClose }) => <Notification type="success" onClose={onClose} {...props} />,
      });

      logger({ label: props.title, content: props.description });
    },
    [toast, logger]
  );
  const error = useCallback(
    (props: ToastProps) => {
      toast({
        ...commonProps,
        render: ({ onClose }) => <Notification type="error" onClose={onClose} {...props} />,
      });

      logger({ label: props.title, content: props.description });
    },
    [toast, logger]
  );

  const handleError = useCallback(
    (err: any) => {
      const errData = tryToGetErrorData(err);
      if (errData) {
        error({ title: errData.title, description: errData.description });
      }

      return errData;
    },
    [error]
  );

  return {
    success,
    error,
    handleError,
  };
};
