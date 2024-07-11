import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  network: Network.MATIC_MAINNET,
  // apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  // network: process.env.REACT_APP_IS_MAINNET ? Network.MATIC_MAINNET : Network.MATIC_MUMBAI,
};

export const alchemy = new Alchemy(settings);

export default alchemy;
