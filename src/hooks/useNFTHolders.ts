import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { alchemy } from '@/modules/alchemy';

const NFT_HOLDERS_REQUEST = 'get-token-holders';

export const useNFTHolder = (tokenAddress: string) => {
  alchemy.nft.getOwnersForContract(tokenAddress);

  const nftHoldersRequest = useQuery(
    [NFT_HOLDERS_REQUEST, tokenAddress],
    async () => await alchemy.nft.getOwnersForContract(tokenAddress)
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
