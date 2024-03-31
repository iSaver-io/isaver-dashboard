import { Interface } from '@ethersproject/abi';
import { Log } from 'alchemy-sdk';
import EthDater from 'ethereum-block-by-date';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK, FROM_BLOCK_EPISODE_2 } from '@/constants';
import alchemy from '@/modules/alchemy';
import { Staking } from '@/types.common';
import { TypedEvent, TypedEventFilter } from '@/types/typechain-types/common';
import {
  ClaimedEventObject,
  StakedEventObject,
  StakedSuperPlanEventObject,
  SuperClaimedEventObject,
  SuperWithdrawnEventObject,
} from '@/types/typechain-types/contracts/Staking';
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

  const stakingIface = new Interface(abi);

  const getAvailableTokens = async (isSAVRToken: boolean) => {
    return contract.getAvailableTokens(isSAVRToken);
  };

  const getStakingPlans = async () => {
    return contract.getStakingPlans();
  };

  const getUserStakingInfo = async (address: string) => {
    return contract.getUserPlansInfo(address);
  };

  const getSuperStakingPlansWithStake = async (address: string) => {
    return contract.getSuperStakingPlansForUser(address);
  };

  const getUserStakesWithRewards = async (address: string, planId: number) => {
    return contract.getUserStakesWithRewards(planId, address);
  };

  const getUserStakes = async (address: string, planId: number) => {
    return contract.getUserStakes(planId, address);
  };

  const getExtraAprPowerC = async () => {
    return contract.extraAprPowerC();
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

  const depositSuperPlan = async ({
    superPlanId,
    amount,
  }: {
    superPlanId: number;
    amount: BigNumberish;
  }) => {
    const tx = await contract.depositSuperPlan(superPlanId, amount);
    return waitForTransaction(tx);
  };

  const claimSuperPLan = async (superPlanId: number) => {
    const tx = await contract.claimSuperPlan(superPlanId);
    return waitForTransaction(tx);
  };

  const withdrawSuperPLan = async (superPlanId: number) => {
    const tx = await contract.withdrawSuperPlan(superPlanId);
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
    const filter = contract.filters.Staked();

    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      alchemy.core.getLogs({ ...filter, fromBlock: FROM_BLOCK, toBlock: 'latest' });

    const events = await fetchEvents(filter);
    return events.map(
      (event) =>
        ({ ...event, ...stakingIface.parseLog(event).args } as unknown as StakedEventObject & Log)
    );
  };

  const getAllClaims = async () => {
    const filter = contract.filters.Claimed();

    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      alchemy.core.getLogs({ ...filter, fromBlock: FROM_BLOCK, toBlock: 'latest' });

    const events = await fetchEvents(filter);
    return events.map(
      (event) =>
        ({ ...event, ...stakingIface.parseLog(event).args } as unknown as ClaimedEventObject & Log)
    );
  };

  const getAllSuperStakes = async () => {
    const filter = contract.filters.StakedSuperPlan();

    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      alchemy.core.getLogs({ ...filter, fromBlock: FROM_BLOCK_EPISODE_2, toBlock: 'latest' });

    const events = await fetchEvents(filter);
    return events.map(
      (event) =>
        ({
          ...event,
          ...stakingIface.parseLog(event).args,
        } as unknown as StakedSuperPlanEventObject & Log)
    );
  };

  const getAllSuperClaimed = async () => {
    const filter = contract.filters.SuperClaimed();

    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      alchemy.core.getLogs({ ...filter, fromBlock: FROM_BLOCK_EPISODE_2, toBlock: 'latest' });

    const events = await fetchEvents(filter);
    return events.map(
      (event) =>
        ({ ...event, ...stakingIface.parseLog(event).args } as unknown as SuperClaimedEventObject &
          Log)
    );
  };

  const getAllSuperWithdrawn = async () => {
    const filter = contract.filters.SuperWithdrawn();

    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      alchemy.core.getLogs({ ...filter, fromBlock: FROM_BLOCK_EPISODE_2, toBlock: 'latest' });

    const events = await fetchEvents(filter);
    return events.map(
      (event) =>
        ({
          ...event,
          ...stakingIface.parseLog(event).args,
        } as unknown as SuperWithdrawnEventObject & Log)
    );
  };

  const updatePlanActivity = async (planId: number, isActive: boolean) => {
    const tx = await contract.updatePlanActivity(planId, isActive);
    return waitForTransaction(tx);
  };

  const addSuperStakingPlan = async (apy: number) => {
    const tx = await contract.addSuperStakingPlan(apy);
    return waitForTransaction(tx);
  };

  const updateSuperPlanActivity = async (superPlanId: number, isActive: boolean) => {
    const tx = await contract.updateSuperPlanActivity(superPlanId, isActive);
    return waitForTransaction(tx);
  };

  const updateExtraAprPowerC = async (apr: number) => {
    const tx = await contract.updateExtraAprPowerC(apr);
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
    addSuperStakingPlan,
    updateSuperPlanActivity,
    updateExtraAprPowerC,
    // Super power
    getExtraAprPowerC,
    getSuperStakingPlansWithStake,
    getAllSuperStakes,
    getAllSuperClaimed,
    getAllSuperWithdrawn,
    depositSuperPlan,
    claimSuperPLan,
    withdrawSuperPLan,
  };
};
