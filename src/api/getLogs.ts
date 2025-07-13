import { BlockTag, Log } from 'alchemy-sdk';

const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;

let requestQueue: Array<{
  resolve: (value: Log[]) => void;
  reject: (error: any) => void;
  params: any;
}> = [];

let isProcessing = false;
let lastRequestTime = 0;

const getHexBlockByNumber = (blockNumber: BlockTag) => {
  if (typeof blockNumber === 'number') {
    return `0x${blockNumber.toString(16)}`;
  }
  return blockNumber;
};

const executeRequest = async (params: any, retryCount = 0): Promise<Log[]> => {
  try {
    const response = await fetch(`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getLogs',
        params: [params],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`JSON-RPC error: ${data.error.message || 'Unknown error'}`);
    }

    return data.result as Log[];
  } catch (error) {
    if (
      retryCount < 3 &&
      error instanceof Error &&
      (error.message.includes('429') || error.message.includes('Internal error'))
    ) {
      const delay = (Math.pow(2, retryCount + 1) + 2) * 1000;
      console.warn(`Request failed, retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return executeRequest(params, retryCount + 1);
    }
    console.warn('Request failed:', error);
    throw error;
  }
};

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) {
    return;
  }

  isProcessing = true;

  while (requestQueue.length > 0) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    // Ждем минимум 1 секунду между запросами
    if (timeSinceLastRequest < 2000) {
      await new Promise((resolve) => setTimeout(resolve, 2000 - timeSinceLastRequest));
    }

    const request = requestQueue.shift();
    if (request) {
      try {
        lastRequestTime = Date.now();
        const result = await executeRequest(request.params);
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }
  }

  isProcessing = false;
};

export const getLogs = async (
  contractAddress: string | undefined,
  topics: (string | string[])[] | undefined,
  fromBlock: BlockTag,
  toBlock: BlockTag
) => {
  try {
    const params = {
      fromBlock: getHexBlockByNumber(fromBlock),
      toBlock: getHexBlockByNumber(toBlock),
      address: contractAddress,
      topics,
    };

    // Добавляем запрос в очередь
    const promise = new Promise<Log[]>((resolve, reject) => {
      requestQueue.push({ resolve, reject, params });
    });

    // Запускаем обработку очереди
    processQueue();

    return await promise;
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
};
