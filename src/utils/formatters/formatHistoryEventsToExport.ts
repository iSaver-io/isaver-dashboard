import { HistoryEvent } from '@/types';

export const formatHistoryEventsToExport = (events: HistoryEvent[]) => {
  const headers = ['Date', 'Event', 'Transaction'];
  const data = events.map((event) => [
    new Date(event.timestamp * 1000),
    event.label,
    event.transactionHash,
  ]);

  return { headers, data };
};
