import { BigNumber } from 'ethers';

import { bigNumberToString } from '../number';
import { getLocalDateTimeString, getReadableDuration } from '../time';

type StakeUnlock = {
  user: string;
  period: number;
  isSAVRToken: boolean;
  profit: BigNumber;
  amount: BigNumber;
  tillTimestamp: number;
};
export const formatStakesUnlocksToExport = (stakes: StakeUnlock[]) => {
  const headers = ['User', 'Unlock SAV', 'End', 'Staking plan'];
  const data = stakes.map((stake) => [
    stake.user,
    bigNumberToString(stake.isSAVRToken ? stake.profit : stake.amount.add(stake.profit)),
    getLocalDateTimeString(stake.tillTimestamp),
    getReadableDuration(stake.period),
  ]);

  return { headers, data };
};
