import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import { useAccounts } from './admin/useAccounts';
import { useContractsAddresses } from './admin/useContractsAddresses';
import { ContractsEnum } from './contracts/useContractAbi';
import { useTokenContract } from './contracts/useTokenContract';

const MAX_SUPPLY = BigNumber.from(10).pow(18).mul(1_000_000_000);
export const useTokenSupply = (token: ContractsEnum.SAV | ContractsEnum.SAVR) => {
  const tokenContract = useTokenContract(token);

  const accounts = useAccounts();
  const contracts = useContractsAddresses();

  const totalSupplyRequest = useQuery(['token-total-supply-query', { token }], () =>
    tokenContract.totalSupply()
  );

  const uniqueAddresses = useMemo(() => {
    return Array.from(new Set([...Object.values(accounts), ...Object.values(contracts)]));
  }, [accounts, contracts]);

  const balances = useQueries({
    queries: uniqueAddresses.map((address) => ({
      queryKey: ['circulating-supply', token, address],
      queryFn: () => tokenContract.balanceOf(address),
    })),
  });

  const circulatingSupply = useMemo(() => {
    if (!totalSupplyRequest.data) return BigNumber.from(0);
    return balances.reduce((sum, balanceRequest) => {
      if (balanceRequest.data) return sum.sub(balanceRequest.data);
      return sum;
    }, totalSupplyRequest.data);
  }, [totalSupplyRequest.data, balances]);

  const totalSupply = useMemo(
    () => totalSupplyRequest.data || BigNumber.from(0),
    [totalSupplyRequest.data]
  );
  const totalBurned = useMemo(() => MAX_SUPPLY.sub(totalSupply), [totalSupply]);

  return {
    totalSupply,
    totalBurned,
    circulatingSupply,
    maxSupply: MAX_SUPPLY,
  };
};
