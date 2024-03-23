// eslint-disable-next-line
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { erc20ABI, erc721ABI, useAccount, useProvider, useSigner } from 'wagmi';

import alchemy from '@/modules/alchemy';
import { IERC1155, IERC20, IERC721 } from '@/types';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from '../contracts/useContractAbi';
import { AddPrizeParamsType, useTokensPoolContract } from '../contracts/useTokensPoolContract';
import { useNotification } from '../useNotification';
import { bigNumberToString } from '@/utils/number';

export const TOKENS_POOL_PRIZES_REQUEST = 'tokens-pool-prizes-request';
export const TOKENS_POOL_TOTAL_CHANCE_REQUEST = 'tokens-pool-total-chance-request';
export const useTokensPoolControl = (
  contractName: ContractsEnum.MomentoTokensPool | ContractsEnum.BirthdayTokensPool
) => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const signerOrProvider = signer || provider;
  const { address } = useAccount();

  const erc1155Abi = useContractAbi({ contract: ContractsEnum.Ticket });

  const contract = useTokensPoolContract(contractName);

  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  const prizesRequest = useQuery([TOKENS_POOL_PRIZES_REQUEST, contractName], () =>
    contract.getPrizes()
  );
  const totalChanceRequest = useQuery([TOKENS_POOL_TOTAL_CHANCE_REQUEST, contractName], () =>
    contract.getTotalChance()
  );

  const createCategoryMutation = useMutation(
    ['tokens-pool-create-category', contractName],
    async (chance: number) => {
      const txHash = await contract.createPrizeCategory(chance);
      success({
        title: 'Success',
        description: `Prize category with chance ${chance} created in ${contractName}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TOKENS_POOL_PRIZES_REQUEST, contractName] });
        queryClient.invalidateQueries({
          queryKey: [TOKENS_POOL_TOTAL_CHANCE_REQUEST, contractName],
        });
      },
      onError: handleError,
    }
  );
  const updateCategoryMutation = useMutation(
    ['tokens-pool-update-category', contractName],
    async ({ categoryId, chance }: { categoryId: number; chance: number }) => {
      const txHash = await contract.updatePrizeCategory(categoryId, chance);
      success({
        title: 'Success',
        description: `Prize category with id ${categoryId} updated to chance ${chance} in ${contractName}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TOKENS_POOL_PRIZES_REQUEST, contractName] });
        queryClient.invalidateQueries({
          queryKey: [TOKENS_POOL_TOTAL_CHANCE_REQUEST, contractName],
        });
      },
      onError: handleError,
    }
  );
  const addPrizeToCategory = useMutation(
    ['tokens-pool-add-prize-to-category', contractName],
    async (params: Omit<AddPrizeParamsType, 'from'>) => {
      if (!address) {
        return null;
      }

      const from = address;
      const { isErc20, isErc721, isErc1155 } = params;

      if (!isErc20 && !isErc721 && !isErc1155) {
        throw new Error(`Token not recognized: ${params.tokenAddress}`);
      }

      let tokenIds = params.tokenIds;
      if (isErc721 && !tokenIds) {
        let totalNfts: any[] = [];
        let pageKey;
        do {
          const nfts: any = await alchemy.nft.getNftsForOwner(from, {
            contractAddresses: [params.tokenAddress],
            omitMetadata: true,
            pageSize: 100,
            pageKey: pageKey ? pageKey : undefined,
          });

          totalNfts = totalNfts.concat(nfts.ownedNfts);
          pageKey = nfts.pageKey;
        } while (pageKey);

        tokenIds = totalNfts.map((nft) => nft.tokenId);
      }

      if ((isErc1155 || isErc721) && !tokenIds.length) {
        throw new Error('tokenIds required for ERC721 and ERC1155 token types');
      }

      if (isErc20) {
        const erc20Contract = new ethers.Contract(
          params.tokenAddress,
          erc20ABI,
          signerOrProvider
        ) as unknown as IERC20;

        const balance = await erc20Contract.balanceOf(from);
        const allowance = await erc20Contract.allowance(from, contract.address);

        const requiredForPrize = params.amount.mul(params.remaining);

        if (balance < requiredForPrize) {
          throw new Error(`${from} balance less than required for prize`);
        }

        if (allowance < requiredForPrize) {
          const approveTx = await erc20Contract.approve(contract.address, requiredForPrize);
          const txHash = await waitForTransaction(approveTx);

          success({
            title: 'Success',
            description: `${bigNumberToString(
              requiredForPrize
            )} tokens approved for ${contractName} contract`,
            txHash,
          });
        }
      }

      if (isErc721) {
        const erc721Contract = new ethers.Contract(
          params.tokenAddress,
          erc721ABI,
          signerOrProvider
        ) as unknown as IERC721;

        const isApproved = await erc721Contract.isApprovedForAll(from, contract.address);

        if (!isApproved) {
          const approveTx = await erc721Contract.setApprovalForAll(contract.address, true);
          const txHash = await waitForTransaction(approveTx);

          success({
            title: 'Success',
            description: `Fully approved for ${contractName} contract`,
            txHash,
          });
        }
      }

      if (isErc1155) {
        const erc1155Contract = new ethers.Contract(
          params.tokenAddress,
          erc1155Abi.abi,
          signerOrProvider
        ) as unknown as IERC1155;

        const balance = await erc1155Contract.balanceOf(from, tokenIds[0]);
        const isApproved = await erc1155Contract.isApprovedForAll(from, contract.address);

        const requiredForPrize = params.amount.mul(params.remaining);

        if (balance < requiredForPrize) {
          throw new Error(`${from} balance less than required for prize`);
        }

        if (!isApproved) {
          const approveTx = await erc1155Contract.setApprovalForAll(contract.address, true);
          const txHash = await waitForTransaction(approveTx);

          success({
            title: 'Success',
            description: `Fully approved for ${contractName} contract`,
            txHash,
          });
        }
      }

      const txHash = await contract.addPrizeToCategory({ ...params, from });
      success({
        title: 'Success',
        description: `Prize added in ${contractName}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TOKENS_POOL_PRIZES_REQUEST, contractName] });
        queryClient.invalidateQueries({
          queryKey: [TOKENS_POOL_TOTAL_CHANCE_REQUEST, contractName],
        });
      },
      onError: handleError,
    }
  );
  const removePrizeFromCategory = useMutation(
    ['tokens-pool-remove-prize-from-category', contractName],
    async ({
      categoryId,
      prizeId,
      toAddress,
    }: {
      categoryId: number;
      prizeId: number;
      toAddress: string;
    }) => {
      const txHash = await contract.removePrizeFromCategory(categoryId, prizeId, toAddress);
      success({
        title: 'Success',
        description: `Prize removed from ${contractName}`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TOKENS_POOL_PRIZES_REQUEST, contractName] });
        queryClient.invalidateQueries({
          queryKey: [TOKENS_POOL_TOTAL_CHANCE_REQUEST, contractName],
        });
      },
      onError: handleError,
    }
  );

  return {
    prizesRequest,
    totalChanceRequest,

    createCategoryMutation,
    updateCategoryMutation,
    addPrizeToCategory,
    removePrizeFromCategory,
  };
};
