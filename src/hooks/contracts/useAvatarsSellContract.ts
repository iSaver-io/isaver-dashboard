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

  const getBasePrice = () => {
    return contract.basePrice();
  };

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

  const getSoldStatistic = () => {
    return contract.getSoldStatistic();
  };

  const buyAvatar = async () => {
    const tx = await contract.buyAvatar();
    return waitForTransaction(tx);
  };

  const buyPower = async (id: BigNumberish, amount: BigNumberish) => {
    const tx = await contract.buyPower(id, amount);
    return waitForTransaction(tx);
  };

  const updateBasePrice = async (price: BigNumberish) => {
    const tx = await contract.updateBasePrice(price);
    return waitForTransaction(tx);
  };

  const updateInflationRate = async (rate: BigNumberish) => {
    const tx = await contract.updateInflationRate(rate);
    return waitForTransaction(tx);
  };

  const updateInflationPeriod = async (period: BigNumberish) => {
    const tx = await contract.updateInflationPeriod(period);
    return waitForTransaction(tx);
  };

  const updatePowerPrice = async (id: BigNumberish, price: BigNumberish) => {
    const tx = await contract.updatePowerPrice(id, price);
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    getBasePrice,
    getAvatarPrice,
    getInflationRate,
    getInflationPeriod,
    getBaseTimestamp,
    getPowerPrice,
    getDivider,
    getSoldStatistic,
    buyAvatar,
    buyPower,
    updateBasePrice,
    updateInflationRate,
    updateInflationPeriod,
    updatePowerPrice,
  };
};
