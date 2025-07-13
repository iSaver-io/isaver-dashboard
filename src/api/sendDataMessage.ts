const BOT_TOKEN = process.env.REACT_APP_TG_API_KEY;
const CHAT_ID_1 = 175764717;
const CHAT_ID_2 = 236571537;

const sendMessage = async (message: string, chatId: number) => {
  return await fetch(
    encodeURI(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=HTML`
    ),
    { method: 'POST' }
  );
};

export const sendDataMessage = async (message: string) => {
  const response = await sendMessage(message, CHAT_ID_2);
  const response2 = await sendMessage(message, CHAT_ID_1);

  const data = await response.json();
  if (response.status !== 200) {
    console.log('Failed to send message', data);
    throw new Error('Failed to send message');
  }

  return data;
};
