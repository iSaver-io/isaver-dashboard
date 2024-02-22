import { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { Teams } from '@/types.common';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useTeamsContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Teams,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as Teams;

  const getPlans = async () => {
    return await contract.getPlans();
  };

  const subscribe = async (planId: number) => {
    const tx = await contract.subscribe(planId);
    return waitForTransaction(tx);
  };

  const updatePlanActivity = async (planId: number, isActive: boolean) => {
    const tx = await contract.updatePlanActivity(planId, isActive);
    return waitForTransaction(tx);
  };

  const addPlan = async ({
    subscriptionCost,
    reward,
    stakingThreshold,
    teamSize,
    stakingPlanId,
  }: {
    subscriptionCost: BigNumber;
    reward: BigNumber;
    stakingThreshold: BigNumber;
    teamSize: number;
    stakingPlanId: number;
  }) => {
    const tx = await contract.addPlan(
      subscriptionCost,
      reward,
      stakingThreshold,
      teamSize,
      stakingPlanId
    );
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    subscribe,
    getPlans,
    updatePlanActivity,
    addPlan,
  };
};
