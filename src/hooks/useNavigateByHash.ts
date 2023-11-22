import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useScrollToHash } from './useScrollToHash';

export const useNavigateByHash = () => {
  const navigate = useNavigate();
  const scroll = useScrollToHash();

  const navigateByHash = useCallback(
    (to: string, offset?: number) => {
      const [path, hash] = to.split('#');

      const needRedirect = window.location.pathname !== path;

      if (needRedirect) {
        navigate(path);
      }

      if (hash) {
        scroll(hash, offset, needRedirect ? 700 : 150);
      }
    },
    [navigate, scroll]
  );

  return navigateByHash;
};
