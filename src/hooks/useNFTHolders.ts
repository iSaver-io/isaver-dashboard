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

export const GET_ALLOWED_NFTS_FOR_OWNER = 'get-allowed-nfts-for-owner';
export const useAllowedNFTsForOwner = () => {
  const { address } = useAccount();
  const approvedCollections = useApprovedCollections();

  const { address: avatarAddress } = useContractAbi({
    contract: ContractsEnum.ISaverAvatars,
  });

  const {
    data: nftsForOwner,
    isLoading,
    refetch,
    isFetching,
  } = useQuery([GET_ALLOWED_NFTS_FOR_OWNER, { address }, approvedCollections], async () => {
    if (!address) return { ownedNfts: [] };

    return await alchemy.nft.getNftsForOwner(address, {
      contractAddresses:
        approvedCollections?.length > 0 ? [avatarAddress, ...approvedCollections] : [avatarAddress],
      omitMetadata: false,
    });
  });

  const sortedNfts = nftsForOwner?.ownedNfts.sort(
    (a, b) =>
      Number(b.contract.address === avatarAddress) - Number(a.contract.address === avatarAddress)
  );

  return {
    nftsForOwner: sortedNfts || [],
    isLoading: isFetching || isLoading,
    refetch,
    avatarAddress,
  };
};

export const GET_NFT = 'get-nft';
export const useActiveAvatarNFT = () => {
  const { address, isConnected } = useAccount();
  const { activeAvatar, hasAvatar } = useActiveAvatar();

  const tokenId = activeAvatar?.tokenId;

  const { data, isLoading, isFetching } = useQuery(
    [GET_NFT, address, tokenId],
    async () => {
      if (!activeAvatar || tokenId === undefined) return null;

      return await alchemy.nft.getNftMetadata(activeAvatar.collection, tokenId, {
        tokenType: NftTokenType.ERC721,
        refreshCache: true,
      });
    },
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: isConnected && hasAvatar,
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
