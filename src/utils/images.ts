import { Nft } from 'alchemy-sdk';

export const getImageLinkForNFT = (nft?: Nft) => {
  const link = nft?.image.pngUrl || nft?.image.cachedUrl || nft?.image.originalUrl;

  // if (link?.includes('ipfs.io') && nft?.contract.openSeaMetadata.imageUrl) {
  //   return nft?.contract.openSeaMetadata.imageUrl;
  // }

  return link;
};
