import { useNetwork } from 'wagmi';

import { ChainIDsEnum } from '@/config/index';

const isMainnetBuild = process.env.REACT_APP_IS_MAINNET;

export const useChainId = () => {
  const { chain } = useNetwork();

  // let chainId = process.env.NODE_ENV === 'production' ? ChainIDsEnum.mainnet : ChainIDsEnum.hardhat;

  return ChainIDsEnum.hardhat;
  let chainId = isMainnetBuild ? ChainIDsEnum.mainnet : ChainIDsEnum.mumbai;
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
