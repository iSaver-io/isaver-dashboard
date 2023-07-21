import axios from 'axios';

const apiKey = process.env.REACT_APP_DB_API_KEY_RAFFLE;

export const dbClientWriter = axios.create({
  headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
});
