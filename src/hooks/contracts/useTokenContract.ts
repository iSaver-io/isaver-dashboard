import EthDater from 'ethereum-block-by-date';
import type { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { Token1 } from '@/types.common';
import { BALANCE_HISTORY_PERIOD } from '@/utils/balance';
import { queryThrowBlocks } from '@/utils/queryThrowBlocks';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export enum SavEvent {
  Transfer = 'Transfer',
  Approval = 'Approval',
}

export enum TOKENS {
  SAV = ContractsEnum.SAV,
  SAVR = ContractsEnum.SAVR,
}

export const useTokenContract = (token: ContractsEnum.SAV | ContractsEnum.SAVR) => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const dater = new EthDater(provider);

  const { address, abi } = useContractAbi({ contract: token });

  const contract = useContract({
    address,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as Token1;

  const balanceOf = async (address: string): Promise<BigNumber> => {
    return contract.balanceOf(address);
  };

  const getBalanceHistoryTransfers = async (account: string) => {
    const { block: fromBlock } = await dater.getDate(Date.now() - BALANCE_HISTORY_PERIOD);
    const { block: toBlock } = await dater.getDate(new Date());

    const filterFrom = contract.filters.Transfer(account);
    const filterTo = contract.filters.Transfer(null, account);

    const fetchTransfersFrom = (from: number, to: number) =>
      contract.queryFilter(filterFrom, from, to);
    const fetchTransfersTo = (from: number, to: number) => contract.queryFilter(filterTo, from, to);

    const fromTransfers = await queryThrowBlocks(fetchTransfersFrom, { fromBlock, toBlock });
    const toTransfers = await queryThrowBlocks(fetchTransfersTo, {
      fromBlock,
      toBlock,
    });

    return (
      [fromTransfers, toTransfers]
        .reduce((acc, transfers) => {
          acc.push(...transfers);
          return acc;
        }, [])
        // @ts-ignore
        .sort((t1, t2) => t1.blockNumber - t2.blockNumber)
    );
  };

  const decimals = async (): Promise<number> => {
    return contract.decimals();
  };

  const allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return contract.allowance(owner, spender);
  };

  const totalSupply = async () => {
    return contract.totalSupply();
  };

  const totalBurned = async () => {
    return contract.totalBurn();
  };

  const approve = async (spender: string, amount: BigNumber): Promise<string> => {
    const tx = await contract.approve(spender, amount);
    return waitForTransaction(tx);
  };

  // Administration
  const paused = async () => {
    return contract.paused();
  };
  const isWhitelistRestrictionMode = async () => {
    return contract.isWhitelistRestrictionMode();
  };

  const addToBlacklist = async (addresses: string[]) => {
    const tx = await contract.addToBlacklist(addresses);
    return waitForTransaction(tx);
  };

  const removeFromBlacklist = async (addresses: string[]) => {
    const tx = await contract.removeFromBlacklist(addresses);
    return waitForTransaction(tx);
  };

  const addToWhitelist = async (addresses: string[]) => {
    const tx = await contract.addToWhitelist(addresses);
    return waitForTransaction(tx);
  };

  const removeFromWhitelist = async (addresses: string[]) => {
    const tx = await contract.removeFromWhitelist(addresses);
    return waitForTransaction(tx);
  };

  const pause = async () => {
    const tx = await contract.pause();
    return waitForTransaction(tx);
  };

  const unpause = async () => {
    const tx = await contract.unpause();
    return waitForTransaction(tx);
  };

  const enableWhitelistMode = async () => {
    const tx = await contract.onWhitelistMode();
    return waitForTransaction(tx);
  };

  const disableWhitelistMode = async () => {
    const tx = await contract.offWhitelistMode();
    return waitForTransaction(tx);
  };

  return {
    contract,
    address,
    balanceOf,
    getBalanceHistoryTransfers,
    decimals,
    allowance,
    approve,
    totalBurned,
    totalSupply,
    // Administration
    paused,
    isWhitelistRestrictionMode,
    pause,
    unpause,
    addToBlacklist,
    addToWhitelist,
    removeFromBlacklist,
    removeFromWhitelist,
    enableWhitelistMode,
    disableWhitelistMode,
  };
};
