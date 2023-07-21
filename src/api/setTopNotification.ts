import { dbClientWriter } from './dbClientWriter';

export const setTopNotification = async (text: string) => {
  const url = encodeURI('https://api.airtable.com/v0/app1BAUNM3F9UtPDd/Notifications');

  return await dbClientWriter
    .patch(url, { records: [{ id: 'recI6Z7bhKJxbxUbT', fields: { text } }] })
    .then((response) => response.data);
};
