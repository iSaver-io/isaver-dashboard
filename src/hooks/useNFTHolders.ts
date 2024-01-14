import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NftTokenType } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

import { alchemy } from '@/modules/alchemy';

import { ContractsEnum, useContractAbi } from './contracts/useContractAbi';
import { useActiveAvatar, useApprovedCollections } from './useAvatarSettings';

const NFT_HOLDERS_REQUEST = 'get-token-holders';
export const useNFTHolder = (tokenAddress: string) => {
  const nftHoldersRequest = useQuery(
    [NFT_HOLDERS_REQUEST, tokenAddress],
    async () => await alchemy.nft.getOwnersForContract(tokenAddress),
    {
      enabled: Boolean(tokenAddress) && tokenAddress !== ethers.constants.AddressZero,
    }
  );

  const nftHolders = useMemo(() => {
    return nftHoldersRequest.data?.owners || [];
  }, [nftHoldersRequest.data]);

  return { nftHoldersRequest, nftHolders };
};

export const useAddressHasNFT = (tokenAddress: string, address?: string) => {
  const { nftHoldersRequest, nftHolders } = useNFTHolder(tokenAddress);

  const hasNFT = useMemo(() => {
    return address && nftHolders && nftHolders.includes(address);
  }, [nftHolders, address]);

  return { nftHoldersRequest, nftHolders, hasNFT };
};

const GET_NFTS_FOR_OWNERS = 'get-nfts-for-owners';
export const useAllowedNFTsForOwner = () => {
  const { address, isConnected } = useAccount();
  const approvedCollections = useApprovedCollections();

  const { address: avatarAddress } = useContractAbi({
    contract: ContractsEnum.ISaverAvatars,
  });

  const {
    data: nftsForOwner,
    isLoading,
    refetch,
    isFetching,
  } = useQuery(
    [GET_NFTS_FOR_OWNERS, address, approvedCollections],
    async () =>
      await alchemy.nft.getNftsForOwner(address!, {
        contractAddresses:
          approvedCollections?.length > 0
            ? [avatarAddress, ...approvedCollections]
            : [avatarAddress],
        omitMetadata: false,
      }),
    { enabled: isConnected }
  );

  const sortedNfts = nftsForOwner?.ownedNfts.sort(
    (a, b) =>
      Number(b.contract.address === avatarAddress) - Number(a.contract.address === avatarAddress)
  );

  return { nftsForOwner: sortedNfts || [], isLoading: isFetching || isLoading, refetch };
};

export const GET_NFT = 'get-nft';
export const useActiveAvatarNFT = () => {
  const { address } = useAccount();
  const { activeAvatar, hasAvatar } = useActiveAvatar();

  const { data, isLoading, isFetching } = useQuery(
    [GET_NFT, address, activeAvatar?.tokenId],
    async () =>
      activeAvatar
        ? await alchemy.nft.getNftMetadata(activeAvatar.collection, activeAvatar.tokenId, {
            tokenType: NftTokenType.ERC721,
            refreshCache: true,
          })
        : null,
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: hasAvatar,
    }
  );

  return {
    avatarNFT: data,
    isLoading,
    isFetching,
    hasAvatar,
    activeAvatar,
  };
};
