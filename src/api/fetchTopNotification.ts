import { dbClient } from './dbClient';

export const fetchTopNotification = async () => {
  const url = encodeURI(
    'https://api.airtable.com/v0/app1BAUNM3F9UtPDd/Notifications?maxRecords=100'
  );

  return await dbClient.get(url).then((response) => response.data?.records[0]?.fields?.text || '');
};
