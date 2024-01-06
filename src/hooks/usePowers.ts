import { BigNumber } from 'ethers';
import { useAccount, useQuery } from 'wagmi';

import { usePowersContract } from './contracts/usePowersContract';

export const GET_POWER_BALANCE = 'get-power-balance';
export const usePowerBalance = (powerId: number) => {
  const { address } = useAccount();
  const { getBalanceOf } = usePowersContract();

  const { data: balance } = useQuery(
    [GET_POWER_BALANCE, address, powerId],
    async () => await getBalanceOf(powerId)
  );

  return balance || BigNumber.from(0);
};
