import { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { TokensPool } from '@/types.common';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export type AddPrizeParamsType = {
  id: number;
  from: string;
  tokenAddress: string;
  isErc20: boolean;
  isErc721: boolean;
  isErc1155: boolean;
  amount: BigNumber;
  remaining: number;
  tokenIds: string[];
};

export const useTokensPoolContract = (
  contractName: ContractsEnum.MomentoTokensPool | ContractsEnum.BirthdayTokensPool
) => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: contractName,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as TokensPool;

  const getPrizes = async () => {
    const totalCategories = (await contract.categoriesLength()).toNumber();

    return (
      await Promise.all(
        Array.from({ length: totalCategories }).map((_, categoryId) => {
          const categoryInfo = contract.getCategory(categoryId);
          const categoryPrizes = contract.getCategoryPrizes(categoryId);

          return Promise.all([categoryId, categoryInfo, categoryPrizes]);
        })
      )
    ).map((val) => ({
      categoryId: val[0],
      info: { chance: val[1][0], prizeIds: val[1][1], isEmpty: val[1][2] },
      prizes: val[2],
    }));
  };

  const getTotalChance = () => {
    return contract.getTotalChance();
  };

  const createPrizeCategory = async (chance: number) => {
    const tx = await contract.createCategory(chance);
    return waitForTransaction(tx);
  };

  const updatePrizeCategory = async (categoryId: number, chance: number) => {
    const tx = await contract.updateCategoryChance(categoryId, chance);
    return waitForTransaction(tx);
  };

  const addPrizeToCategory = async ({
    id,
    from,
    tokenAddress,
    isErc20,
    isErc721,
    isErc1155,
    amount,
    remaining,
    tokenIds,
  }: AddPrizeParamsType) => {
    const tx = await contract.addPrizeToCategory(
      id,
      from,
      tokenAddress,
      isErc20,
      isErc721,
      isErc1155,
      amount,
      tokenIds,
      remaining
    );
    return waitForTransaction(tx);
  };

  const removePrizeFromCategory = async (
    categoryId: number,
    prizeId: number,
    toAddress: string
  ) => {
    const tx = await contract.removePrizeInCategory(categoryId, prizeId, toAddress);
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,

    getPrizes,
    getTotalChance,

    createPrizeCategory,
    updatePrizeCategory,
    addPrizeToCategory,
    removePrizeFromCategory,
  };
};
