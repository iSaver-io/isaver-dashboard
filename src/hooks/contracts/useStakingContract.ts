import { Interface, LogDescription } from '@ethersproject/abi';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK } from '@/constants';
import alchemy from '@/modules/alchemy';
import { Staking } from '@/types.common';
import { ClaimedEvent, StakedEvent } from '@/types/typechain-types/contracts/Staking';
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

  const { address: contractAddress, abi } = useContractAbi({ contract: ContractsEnum.Staking });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as Staking;

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

  const withdrawAll = async (planId: number): Promise<string> => {
    const tx = await contract.withdrawAll(planId);
    return waitForTransaction(tx);
  };

  const deposit = async ({
    planId,
    amount,
    referrer,
    isToken2,
  }: {
    planId: number;
    amount: BigNumberish;
    isToken2: boolean;
    referrer?: string;
  }) => {
    const tx = await contract.deposit(
      planId,
      amount,
      isToken2,
      referrer || ethers.constants.AddressZero
    );
    return waitForTransaction(tx);
  };

  const getAllStakes = async () => {
    const filter = contract.filters.Staked();

    const stakeLogs = await alchemy.core.getLogs({
      ...filter,
      fromBlock: FROM_BLOCK,
      toBlock: 'latest',
    });

    LogDescription;
    const stakingIface = new Interface(abi);
    const parsed = stakeLogs.map((e) => stakingIface.parseLog(e) as LogDescription & StakedEvent);
    return parsed;
  };

  const getAllClaims = async () => {
    const filter = contract.filters.Claimed();

    const claimLogs = await alchemy.core.getLogs({
      ...filter,
      fromBlock: FROM_BLOCK,
      toBlock: 'latest',
    });
    const stakingIface = new Interface(abi);
    const parsed = claimLogs.map((e) => stakingIface.parseLog(e) as LogDescription & ClaimedEvent);
    return parsed;
  };

  const updatePlanActivity = async (planId: number, isActive: boolean) => {
    const tx = await contract.updatePlanActivity(planId, isActive);
    return waitForTransaction(tx);
  };

  const addStakingPlan = async (
    subscriptionCost: BigNumber,
    subscriptionDuration: number,
    stakingDuration: number,
    apr: number
  ) => {
    const tx = await contract.addStakingPlan(
      subscriptionCost,
      subscriptionDuration,
      stakingDuration,
      apr
    );
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    deposit,
    withdraw,
    withdrawAll,
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
