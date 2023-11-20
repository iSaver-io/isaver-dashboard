import { useNetwork } from 'wagmi';

import { ChainIDsEnum } from '@/config/index';

export const useChainId = () => {
  const { chain } = useNetwork();

  // let chainId = process.env.NODE_ENV === 'production' ? ChainIDsEnum.mainnet : ChainIDsEnum.hardhat;
  // let chainId = ChainIDsEnum.mainnet;
  let chainId = ChainIDsEnum.mumbai;
  if (chain?.network === 'matic') {
    chainId = ChainIDsEnum.mainnet;
  }
  if (chain?.network === 'maticmum') {
    chainId = ChainIDsEnum.mumbai;
  }
  if (chain?.network === 'hardhat') {
    chainId = ChainIDsEnum.hardhat;
  }

  return chainId;
};
