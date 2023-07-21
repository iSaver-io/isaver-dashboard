import { Stake } from '@/types';

import { bigNumberToNumber } from '../number';
import { getReadableDuration } from '../time';

export const formatStakesToExport = (stakes: Stake[]) => {
  const headers = ['Token', 'Deposit', 'Period', 'Start', 'End', 'Reward', 'Total', 'Status'];
  const data = stakes.map((stake) => [
    stake.isToken2 ? 'SAVR' : 'SAV',
    bigNumberToNumber(stake.amount),
    getReadableDuration(stake.period),
    new Date(stake.timeStart * 1000),
    new Date(stake.timeEnd * 1000),
    bigNumberToNumber(stake.profit),
    bigNumberToNumber(stake.reward),
    stake.status,
  ]);

  return { headers, data };
};
