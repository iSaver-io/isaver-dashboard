import { useCallback, useEffect, useState } from 'react';

export const REFERRER_SEARCH_PARAMS_KEY = 'r';
const REFERRER_STORAGE_KEY = 'ref';

export const useLocalReferrer = () => {
  const [localReferrer, setReferrer] = useState<string>();

  const setLocalReferrer = useCallback((ref: string | undefined) => {
    if (ref) {
      localStorage.setItem(REFERRER_STORAGE_KEY, ref);
    }
    setReferrer(ref);
  }, []);

  const resetLocalReferrer = useCallback(() => {
    localStorage.removeItem(REFERRER_STORAGE_KEY);
  }, []);

  const getLocalReferrer = useCallback(() => {
    return localStorage.getItem(REFERRER_STORAGE_KEY);
  }, []);

  useEffect(() => {
    const localRef = getLocalReferrer();
    setReferrer(localRef ?? undefined);
  }, [getLocalReferrer]);

  return {
    localReferrer,
    setLocalReferrer,
    resetLocalReferrer,
    getLocalReferrer,
  };
};
