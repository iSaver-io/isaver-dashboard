import { dbClient } from './dbClient';

export const fetchRoundTitles = async () => {
  const url = encodeURI('https://api.airtable.com/v0/app1BAUNM3F9UtPDd/Titles?maxRecords=100');

  return await dbClient.get(url).then((response) => response.data);
};
