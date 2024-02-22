import { HistoryEvent } from '@/types';

import { getLocalDateTimeString } from '../time';

export const formatHistoryEventsToExport = (events: HistoryEvent[]) => {
  const headers = ['Date', 'Event', 'Transaction'];
  const data = events.map((event) => [
    getLocalDateTimeString(event.timestamp),
    event.label,
    event.transactionHash,
  ]);

  return { headers, data };
};
