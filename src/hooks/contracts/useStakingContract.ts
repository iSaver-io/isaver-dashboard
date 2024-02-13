import EthDater from 'ethereum-block-by-date';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK } from '@/constants';
import { Staking } from '@/types.common';
import { queryThrowBlocks } from '@/utils/queryThrowBlocks';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export enum StakingEvent {
  Staked = 'Staked',
  Claimed = 'Claimed',
  StakingPlanCreated = 'StakingPlanCreated',
  ActivityChanged = 'ActivityChanged',
  Subscribed = 'Subscribed',
}

export const useStakingContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const dater = new EthDater(provider);

  const { address: contractAddress, abi } = useContractAbi({ contract: ContractsEnum.Staking });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as Staking;

  const getAvailableTokens = async (isSAVRToken: boolean) => {
    return contract.getAvailableTokens(isSAVRToken);
  };

  const getStakingPlans = async () => {
    return contract.getStakingPlans();
  };

  const getUserStakingInfo = async (address: string) => {
    return contract.getUserPlansInfo(address);
  };

  const getUserStakesWithRewards = async (address: string, planId: number) => {
    return contract.getUserStakesWithRewards(planId, address);
  };

  const getUserStakes = async (address: string, planId: number) => {
    return contract.getUserStakes(planId, address);
  };

  const subscribe = async (planId: number): Promise<string> => {
    const tx = await contract.subscribe(planId);
    return waitForTransaction(tx);
  };

  const withdraw = async (planId: number, stakeId: number): Promise<string> => {
    const tx = await contract.withdraw(planId, stakeId);
    return waitForTransaction(tx);
  };

  const withdrawAllCompleted = async (planId: number): Promise<string> => {
    const tx = await contract.withdrawAllCompleted(planId);
    return waitForTransaction(tx);
  };

  const deposit = async ({
    planId,
    amount,
    referrer,
    isSAVRToken,
  }: {
    planId: number;
    amount: BigNumberish;
    isSAVRToken: boolean;
    referrer?: string;
  }) => {
    const tx = await contract.deposit(
      planId,
      amount,
      isSAVRToken,
      referrer || ethers.constants.AddressZero
    );
    return waitForTransaction(tx);
  };

  const getAllStakes = async () => {
    const { block: toBlock } = await dater.getDate(new Date());
    const filter = contract.filters.Staked();

    const fetchEvents = (from: number, to: number) => contract.queryFilter(filter, from, to);

    return await queryThrowBlocks(fetchEvents, { fromBlock: FROM_BLOCK, toBlock });
  };

  const getAllClaims = async () => {
    const { block: toBlock } = await dater.getDate(new Date());
    const filter = contract.filters.Claimed();

    const fetchEvents = (from: number, to: number) => contract.queryFilter(filter, from, to);

    return await queryThrowBlocks(fetchEvents, { fromBlock: FROM_BLOCK, toBlock });
  };

  const updatePlanActivity = async (planId: number, isActive: boolean) => {
    const tx = await contract.updatePlanActivity(planId, isActive);
    return waitForTransaction(tx);
  };

  const addStakingPlan = async (
    subscriptionCost: BigNumber,
    subscriptionDuration: number,
    stakingDuration: number,
    apr: number,
    isSuperPowered: boolean
  ) => {
    const tx = await contract.addStakingPlan(
      subscriptionCost,
      subscriptionDuration,
      stakingDuration,
      apr,
      isSuperPowered
    );
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    deposit,
    withdraw,
    withdrawAllCompleted,
    getAvailableTokens,
    getStakingPlans,
    getUserStakingInfo,
    getUserStakesWithRewards,
    getUserStakes,
    subscribe,
    getAllStakes,
    getAllClaims,
    updatePlanActivity,
    addStakingPlan,
  };
};
