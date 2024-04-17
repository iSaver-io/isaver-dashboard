import { useCallback } from 'react';

import { useTopNotification } from './useTopNotification';

export const useScrollToHash = () => {
  const { topNotification } = useTopNotification();

  const scroll = useCallback(
    (hash: string, offset?: number, delay = 150) => {
      setTimeout(() => {
        const el = window.document.getElementById(hash);
        if (el) {
          const notificationOffset = topNotification ? 50 : 0;
          const resOffset = offset || (window.innerWidth > 1599 ? 140 : 100) + notificationOffset;
          const y = el.getBoundingClientRect().top + window.scrollY - resOffset;
          window.scroll({
            top: y,
            behavior: 'smooth',
          });
        }
      }, delay);
    },
    [topNotification]
  );

  return scroll;
};
