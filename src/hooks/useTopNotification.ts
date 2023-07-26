import { useCallback, useMemo, useState } from 'react';

import { useDashboardConfig } from './useDashboardConfig';

export const TOP_NOTIFICATION_REQUEST = 'top-notification-request';
const NOTIFICATION_READ_STORAGE_KEY = 'ntf-read';
const SHOW_DELAY_TS = 30 * 24 * 3600 * 1000; // 30 days

export const useTopNotification = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { topNotification: topNotificationFirestoreValue } = useDashboardConfig();

  const topNotification = useMemo(() => {
    const currentMessage = topNotificationFirestoreValue;
    if (!currentMessage || !isOpen) return null;

    const closedData = JSON.parse(localStorage.getItem(NOTIFICATION_READ_STORAGE_KEY) || '{}');
    if (
      !closedData ||
      closedData.msg !== currentMessage ||
      closedData.ts + SHOW_DELAY_TS < Date.now()
    )
      return currentMessage;

    return null;
  }, [topNotificationFirestoreValue, isOpen]);

  const closeNotification = useCallback(() => {
    localStorage.setItem(
      NOTIFICATION_READ_STORAGE_KEY,
      JSON.stringify({ msg: topNotification, ts: Date.now() })
    );
    setIsOpen(false);
  }, [topNotification]);

  return { topNotification, closeNotification };
};
