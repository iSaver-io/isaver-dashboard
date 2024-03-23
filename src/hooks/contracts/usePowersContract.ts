import { Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK_EPISODE_2 } from '@/constants';
import alchemy from '@/modules/alchemy';
import { ISaverPowers } from '@/types.common';
import { TypedEvent, TypedEventFilter } from '@/types/typechain-types/common';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const usePowersContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: powersAddress, abi } = useContractAbi({
    contract: ContractsEnum.ISaverPowers,
  });

  const contract = useContract({
    address: powersAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as ISaverPowers;

  const powersIface = new Interface(abi);

  const getBalanceOf = (address: string, powerId: number) => {
    return contract.balanceOf(address, powerId);
  };

  const getTotalSupply = (powerId: number) => {
    return contract.totalSupply(powerId);
  };

  const getAllMintTransfers = async () => {
    const filter = contract.filters.TransferSingle(undefined, ethers.constants.AddressZero);
    const filterBatch = contract.filters.TransferBatch(undefined, ethers.constants.AddressZero);

    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      alchemy.core.getLogs({ ...filter, fromBlock: FROM_BLOCK_EPISODE_2, toBlock: 'latest' });

    const events = (await Promise.all([fetchEvents(filter), fetchEvents(filterBatch)])).flat();

    return events.map((event) => powersIface.parseLog(event));
  };

  return {
    powersContract: contract,
    getBalanceOf,
    getTotalSupply,
    getAllMintTransfers,
  };
};
