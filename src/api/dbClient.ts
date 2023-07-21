import axios from 'axios';

const apiKey = process.env.REACT_APP_DB_API_KEY;

export const dbClient = axios.create({
  headers: { Authorization: `Bearer ${apiKey}` },
});
