import { useContract, useProvider, useSigner } from 'wagmi';

import { Helper } from '@/types.common';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useHelperContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Helper,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as Helper;

  const getReferralsFullInfoByLevel = async (user: string, level: number) => {
    const res = await contract.getUserReferralsFullInfoByLevel(user, level);
    return res.map((r) => ({ ...r }));
  };

  const getUserTeamsInfo = async (address: string) => {
    const res = await contract.getUserTeamsInfo(address);
    return res.map(({ plan, teamStatus, members, userHasSufficientStaking }) => ({
      plan: { ...plan },
      teamStatus: { ...teamStatus },
      members,
      userHasSufficientStaking,
    }));
  };

  const getRafflesRoundWinnersWithTickets = async (roundId?: number) => {
    return roundId !== undefined
      ? await contract.getRafflesRoundWinnersWithTickets(roundId)
      : Promise.reject('Round id is undefined');
  };

  return {
    contract,
    address: contractAddress,
    getReferralsFullInfoByLevel,
    getUserTeamsInfo,
    getRafflesRoundWinnersWithTickets,
  };
};
