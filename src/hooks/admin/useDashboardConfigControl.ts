import { useCallback, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { addDoc, updateDoc } from 'firebase/firestore';

import { auth, configDoc, rafflesCollection } from '@/modules/firebase';

export const useFirebaseAuth = () => {
  const [user] = useAuthState(auth);

  const isAuthorized = Boolean(user);

  const isAdmin = useMemo(
    () =>
      user && ['kAEYkPpIYBMMVcUP3xGy5tM3oP42', 'SrQwnXw0Cah8OHzbRvVwjJST51h1'].includes(user?.uid),
    [user]
  );

  const signIn = useCallback(() => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }, []);

  const signOut = useCallback(() => {
    return auth.signOut();
  }, []);

  return {
    isAuthorized,
    isAdmin,
    signIn,
    signOut,
  };
};

export const useDashboardConfigControl = () => {
  const setIsExchangeSellEnabled = useCallback(async (value: boolean) => {
    return await updateDoc(configDoc, {
      isExchangeSellEnabled: value,
    });
  }, []);
  const setTopNotification = useCallback(async (value: string | undefined) => {
    return await updateDoc(configDoc, {
      topNotification: value,
    });
  }, []);

  const setRaffleRoundParams = useCallback(
    async (id: number, title: string, description?: string) => {
      return await addDoc(rafflesCollection, {
        raffle_id: id,
        title,
        description,
      });
    },
    []
  );

  return {
    setIsExchangeSellEnabled,
    setTopNotification,
    setRaffleRoundParams,
  };
};
