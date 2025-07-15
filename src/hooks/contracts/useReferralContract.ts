import { Interface } from '@ethersproject/abi';
import { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { getLogs } from '@/api/getLogs';
import { FROM_BLOCK } from '@/constants';
import { ReferralManager } from '@/types.common';
import { DividendsAddedEventObject } from '@/types/typechain-types/contracts/ReferralManager';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useReferralContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.ReferralManager,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as ReferralManager;

  const getUserInfo = async (address: string) => {
    return contract.getUserInfo(address);
  };

  const hasFullSubscription = async (address: string) => {
    return contract.userHasFullSubscription(address);
  };

  const userHasActivePowerA = async (address: string) => {
    return contract.userHasActivePowerA(address);
  };

  const userHasActivatedPowerA = async (address: string) => {
    return contract.userHasActivatedPowerA(address);
  };

  const subscribeToLevel = async (level: number): Promise<string> => {
    const tx = await contract.subscribeToLevel(level);
    return waitForTransaction(tx);
  };

  const subscribeToAllLevels = async (): Promise<string> => {
    const tx = await contract.subscribeToAllLevels();
    return waitForTransaction(tx);
  };

  const setMyReferrer = async (referrer: string) => {
    const tx = await contract.setMyReferrer(referrer);
    return waitForTransaction(tx);
  };

  const claimRewards = async (amount: BigNumber) => {
    const tx = await contract.claimDividends(amount);
    return waitForTransaction(tx);
  };

  const getRewards = async (account: string) => {
    const referralInterface = new Interface(abi);
    const filter = contract.filters.DividendsAdded(account);
    const logs = await getLogs(filter.address, filter.topics, FROM_BLOCK, 'latest');
    const events = logs.map(
      (log) => referralInterface.parseLog(log).args as unknown as DividendsAddedEventObject
    );
    return events;
  };

  const updateLevelSubscriptionCost = async (newCost: BigNumber) => {
    const tx = await contract.updateLevelSubscriptionCost(newCost);
    return waitForTransaction(tx);
  };

  const updateFullSubscriptionCost = async (newCost: BigNumber) => {
    const tx = await contract.updateFullSubscriptionCost(newCost);
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    getUserInfo,
    subscribeToLevel,
    subscribeToAllLevels,
    setMyReferrer,
    claimRewards,
    getRewards,
    updateLevelSubscriptionCost,
    updateFullSubscriptionCost,
    // Super power
    hasFullSubscription,
    userHasActivePowerA,
    userHasActivatedPowerA,
  };
};
