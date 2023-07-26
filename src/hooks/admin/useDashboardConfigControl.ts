import { useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { addDoc, updateDoc } from 'firebase/firestore';

import { auth, configDoc, rafflesCollection } from '@/modules/firebase';

export const useDashboardConfigControl = () => {
  const [user] = useAuthState(auth);

  const isAuthorized = Boolean(user);

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

  const signIn = useCallback(() => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }, []);

  const signOut = useCallback(() => {
    return auth.signOut();
  }, []);

  return {
    isAuthorized,
    setIsExchangeSellEnabled,
    setTopNotification,
    setRaffleRoundParams,
    signIn,
    signOut,
  };
};
