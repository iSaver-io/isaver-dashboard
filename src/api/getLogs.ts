import { BlockTag, Log } from 'alchemy-sdk';

const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;

const getHexBlockByNumber = (blockNumber: BlockTag) => {
  if (typeof blockNumber === 'number') {
    return `0x${blockNumber.toString(16)}`;
  }
  return blockNumber;
};

export const getLogs = async (
  contractAddress: string | undefined,
  topics: (string | string[])[] | undefined,
  fromBlock: BlockTag,
  toBlock: BlockTag
) => {
  try {
    const response = await fetch(`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getLogs',
        params: [
          {
            fromBlock: getHexBlockByNumber(fromBlock),
            toBlock: getHexBlockByNumber(toBlock),
            address: contractAddress,
            topics,
          },
        ],
        id: 1,
      }),
    });

    const data = await response.json();
    return data.result as Log[];
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
};
