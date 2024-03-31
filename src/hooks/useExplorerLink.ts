import { useMemo } from 'react';
import { useNetwork } from 'wagmi';

import { getExplorerLink } from '@/utils/getExplorerLink';

export const useExplorerLink = (hash: string, type: 'address' | 'tx' | 'token') => {
  const { chain } = useNetwork();

  return useMemo(() => getExplorerLink({ chain, hash, type }), [hash, chain, type]);
};
