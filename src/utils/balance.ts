import { BigNumber } from 'ethers';

import { TransferEvent } from '@/types/typechain-types/contracts/tokens/BasicToken';

import { bigNumberToNumber } from './number';

export const BALANCE_HISTORY_PERIOD = 1 * 30 * 24 * 60 * 60 * 1000; // 1 month

type BalanceHistoryType = {
  savToken: number;
  token2: number;
  block: number;
};
type BalanceHistoryReturnType = BalanceHistoryType[];
export const getBalanceHistoryFromTransfers = (
  savTokenTransfers: TransferEvent[],
  token2Transfers: TransferEvent[],
  currentSAVTokenBalance: BigNumber,
  currentSAVRTokenBalance: BigNumber,
  currentBlock: number,
  userAccount: string
): BalanceHistoryReturnType => {
  // @ts-ignore
  const savTokenAddress = savTokenTransfers[0] ? savTokenTransfers[0].address : null;

  const tokensHistory = savTokenTransfers
    .concat(token2Transfers)
    // @ts-ignore
    .sort((t1, t2) => t2.blockNumber - t1.blockNumber)
    .reduce(
      (acc, transfer) => {
        // @ts-ignore
        const block = transfer.blockNumber;
        // @ts-ignore
        const isSAVToken = transfer.address === savTokenAddress;
        let transferAmount = bigNumberToNumber(transfer.args.value);
        if (transfer.args.from === userAccount) {
          transferAmount = -transferAmount;
        }

        const lastBalance = acc[acc.length - 1];

        if (lastBalance.block === block) {
          if (isSAVToken) {
            acc[acc.length - 1].savToken -= transferAmount;
          } else {
            acc[acc.length - 1].token2 -= transferAmount;
          }
        } else {
          if (isSAVToken) {
            acc.push({
              savToken: lastBalance.savToken - transferAmount,
              token2: lastBalance.token2,
              block,
            });
          } else {
            acc.push({
              savToken: lastBalance.savToken,
              token2: lastBalance.token2 - transferAmount,
              block,
            });
          }
        }

        return acc;
      },
      [
        {
          savToken: bigNumberToNumber(currentSAVTokenBalance),
          token2: bigNumberToNumber(currentSAVRTokenBalance),
          block: currentBlock,
        },
      ] as BalanceHistoryType[]
    )
    .reverse();

  // Hack for preventing single dot on chart
  if (tokensHistory.length === 1) {
    tokensHistory.push({ ...tokensHistory[0], block: tokensHistory[0].block + 1 });
  }

  return tokensHistory;
};
