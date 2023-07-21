import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchTopNotification } from '@/api/fetchTopNotification';
import { setTopNotification } from '@/api/setTopNotification';

import { useNotification } from './useNotification';

export const TOP_NOTIFICATION_REQUEST = 'top-notification-request';
const NOTIFICATION_READ_STORAGE_KEY = 'ntf-read';
const SHOW_DELAY_TS = 30 * 24 * 3600 * 1000; // 30 days

export const useTopNotification = () => {
  const [isOpen, setIsOpen] = useState(true);

  const topNotificationRequest = useQuery({
    queryKey: [TOP_NOTIFICATION_REQUEST],
    queryFn: () => fetchTopNotification(),
  });

  const topNotification = useMemo(() => {
    const currentMessage = topNotificationRequest.data as string;
    if (!currentMessage || !isOpen) return null;

    const closedData = JSON.parse(localStorage.getItem(NOTIFICATION_READ_STORAGE_KEY) || '{}');
    if (
      !closedData ||
      closedData.msg !== currentMessage ||
      closedData.ts + SHOW_DELAY_TS < Date.now()
    )
      return currentMessage;

    return null;
  }, [topNotificationRequest.data, isOpen]);

  const closeNotification = useCallback(() => {
    localStorage.setItem(
      NOTIFICATION_READ_STORAGE_KEY,
      JSON.stringify({ msg: topNotification, ts: Date.now() })
    );
    setIsOpen(false);
  }, [topNotification]);

  return { topNotificationRequest, topNotification, closeNotification };
};

export const useTopNotificationControl = () => {
  const queryClient = useQueryClient();
  const { success, handleError } = useNotification();

  const updateTopNotification = useMutation(
    ['update-top-notification'],
    async (text: string) => {
      await setTopNotification(text);
      success({ title: 'Success', description: 'Top notification has changed' });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([TOP_NOTIFICATION_REQUEST]);
      },
      onError: handleError,
    }
  );
  return { updateTopNotification };
};
