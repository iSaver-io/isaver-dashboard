import { BigNumberish } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { VendorSell } from '@/types.common';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useVendorSellContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.VendorSell,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as VendorSell;

  const getSwapRate = () => {
    return contract.swapRate();
  };

  const getSellTokenCommission = () => {
    return contract.sellTokenFee();
  };

  const getDivider = () => {
    return contract.DIVIDER();
  };

  const isSellAvailable = () => {
    return contract.isSellAvailable();
  };

  const buyTokens = async (spendAmount: BigNumberish) => {
    const tx = await contract.buyTokens(spendAmount);
    return waitForTransaction(tx);
  };

  const sellTokens = async (sellAmount: BigNumberish) => {
    const tx = await contract.sellTokens(sellAmount);
    return waitForTransaction(tx);
  };

  const updateSellFee = async (fee: number) => {
    const tx = await contract.updateSellFee(fee);
    return waitForTransaction(tx);
  };

  const enableSell = async () => {
    const tx = await contract.enableSell();
    return waitForTransaction(tx);
  };

  const disableSell = async () => {
    const tx = await contract.disableSell();
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    getSwapRate,
    getSellTokenCommission,
    getDivider,
    isSellAvailable,
    buyTokens,
    sellTokens,
    updateSellFee,
    enableSell,
    disableSell,
  };
};
