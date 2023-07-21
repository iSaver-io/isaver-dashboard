import { Chain } from 'wagmi';
import { polygon } from 'wagmi/chains';

export const getExplorerLink = (chain?: Chain, hash?: string, isAddress?: boolean) => {
  if (!hash) return '';

  const type = isAddress ? 'address' : 'tx';

  if (chain?.id === polygon.id) {
    return `https://polygonscan.com/${type}/${hash}`;
  }

  return `https://mumbai.polygonscan.com/${type}/${hash}`;
};
