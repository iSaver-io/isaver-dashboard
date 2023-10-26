import { Chain, useNetwork } from 'wagmi';

import Contracts from '@/config/contracts.json';

import { useChainId } from './useChainId';

export enum ContractsEnum {
  'SAV' = 'ISaverSAVToken',
  'SAVR' = 'ISaverSAVRToken',
  'Staking' = 'Staking',
  'ReferralManager' = 'ReferralManager',
  'Teams' = 'Teams',
  'Helper' = 'Helper',
  'VendorSell' = 'VendorSell',
  'Raffles' = 'Raffles',
  'Ticket' = 'Ticket',
  'TokenVesting' = 'TokenVesting',
  'TokenVesting_OLD' = 'TokenVesting_OLD',
}

type ContractAbi = {
  address: `0x${string}`;
  abi: any;
};

export const useContractAbi = ({
  contract,
}: {
  contract: ContractsEnum;
}): ContractAbi & { chain: Chain } => {
  const { chain } = useNetwork();

  const chainId = useChainId();
  console.log(contract, Contracts);

  //   TODO: fix TS return type
  const contractData = (Contracts as any)[chainId][0].contracts[contract];

  return { ...contractData, chain };
};
