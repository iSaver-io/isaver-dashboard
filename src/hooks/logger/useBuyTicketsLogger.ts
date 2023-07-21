import { useCallback } from 'react';

import { useLogger } from '../useLogger';

type EventType = 'dashboard' | 'raffle';
export const useBuyTicketsLogger = (event?: EventType) => {
  const logger = useLogger({
    category: 'elements',
    action: 'button_click',
    label: 'buy_tickets',
    context: 'raffles',
    buttonLocation: 'down',
    actionGroup: 'interactions',
  });

  return useCallback(
    (localEvent?: EventType) => {
      if (!localEvent && !event) {
        throw new Error('No event passed to useBuyTicketsLogger hook');
      }
      logger({ event: localEvent || event || 'dashboard' });
    },
    [logger, event]
  );
};
