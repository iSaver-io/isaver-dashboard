import { dbClientWriter } from './dbClientWriter';

export const setRaffleRoundData = async (id: number, title: string, description?: string) => {
  const url = encodeURI('https://api.airtable.com/v0/app1BAUNM3F9UtPDd/Titles');

  return await dbClientWriter
    .post(url, { records: [{ fields: { id, title, description } }] })
    .then((response) => response.data);
};
