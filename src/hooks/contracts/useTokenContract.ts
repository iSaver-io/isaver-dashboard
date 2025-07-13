import EthDater from 'ethereum-block-by-date';
import type { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { getLogs } from '@/api/getLogs';
import { ISaverSAVRToken } from '@/types.common';
import { TransferEvent } from '@/types/typechain-types/contracts/mocks/ERC20BurnableMock';
import { BALANCE_HISTORY_PERIOD } from '@/utils/balance';
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
  }) as unknown as ISaverSAVRToken;

  const balanceOf = async (address: string): Promise<BigNumber> => {
    return contract.balanceOf(address);
  };

  const getBalanceHistoryTransfers = async (account: string): Promise<TransferEvent[]> => {
    const { block: fromBlock } = await dater.getDate(Date.now() - BALANCE_HISTORY_PERIOD);
    const { block: toBlock } = await dater.getDate(new Date());

    const filterFrom = contract.filters.Transfer(account);
    const filterTo = contract.filters.Transfer(null, account);

    const transferFromLogs = await getLogs(
      filterFrom.address,
      filterFrom.topics,
      fromBlock,
      toBlock
    );
    const transferToLogs = await getLogs(filterTo.address, filterTo.topics, fromBlock, toBlock);

    const parseLogs = (logs: any[]) => {
      return logs.map((log) => {
        // Парсим событие Transfer
        const parsedLog = contract.interface.parseLog(log);
        return {
          ...log,
          args: parsedLog.args,
          blockNumber: Number(log.blockNumber),
        } as TransferEvent;
      });
    };

    const allLogs = [...(transferFromLogs || []), ...(transferToLogs || [])];
    return parseLogs(allLogs).sort((t1, t2) => t1.blockNumber - t2.blockNumber);
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
    const gas = await contract.estimateGas.approve(spender, amount);
    const tx = await contract.approve(spender, amount, { gasLimit: gas.mul(11).div(10) }); // add 10% to gas limit
    return waitForTransaction(tx);
  };

  // Administration
  const addToWhiteList = async (addresses: string[]) => {
    const tx = await contract.addToWhiteList(addresses);
    return waitForTransaction(tx);
  };

  const removeFromWhiteList = async (addresses: string[]) => {
    const tx = await contract.removeFromWhiteList(addresses);
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
    addToWhiteList,
    removeFromWhiteList,
  };
};
