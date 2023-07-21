import { useMemo } from 'react';
import { useNetwork } from 'wagmi';

import { getExplorerLink } from '@/utils/getExplorerLink';

export const useExplorerLink = (hash?: string, isAddress?: boolean) => {
  const { chain } = useNetwork();

  return useMemo(() => getExplorerLink(chain, hash, isAddress), [hash, chain, isAddress]);
};
