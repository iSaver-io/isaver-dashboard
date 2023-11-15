import { BigNumberish } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { AvatarsSell } from '@/types.common';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useAvatarsSellContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.AvatarsSell,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as AvatarsSell;

  const getAvatarPrice = () => {
    return contract.getCurrentAvatarPrice();
  };

  const getPowerPrice = (id: BigNumberish) => {
    return contract.powerPrices(id);
  };

  const getInflationRate = () => {
    return contract.inflationRate();
  };

  const getInflationPeriod = () => {
    return contract.inflationPeriod();
  };

  const getBaseTimestamp = () => {
    return contract.baseTimestamp();
  };

  const getDivider = () => {
    return contract.divider();
  };

  const buyAvatar = async () => {
    const tx = await contract.buyAvatar();
    return waitForTransaction(tx);
  };

  const buyPower = async (id: BigNumberish, amount: BigNumberish) => {
    const tx = await contract.buyPower(id, amount);
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    getAvatarPrice,
    getInflationRate,
    getInflationPeriod,
    getBaseTimestamp,
    getPowerPrice,
    getDivider,
    buyAvatar,
    buyPower,
  };
};
