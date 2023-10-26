import { useMemo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { DocumentData } from 'firebase/firestore';

import { rafflesCollection } from '@/modules/firebase';

export type RaffleAdditionalData = Record<number, { title: string; description?: string }>;

export const useRaffleRoundAdditionalData = () => {
  const [rafflesData, isRafflesDataLoading, rafflesDataError] =
    useCollectionData(rafflesCollection);

  if (rafflesDataError) {
    console.error('rafflesDataError', rafflesDataError);
  }

  const raffleRoundDataMap = useMemo(() => {
    if (rafflesData) {
      return rafflesData.reduce((acc: RaffleAdditionalData, item: DocumentData) => {
        acc[item.raffle_id] = {
          title: item.title,
          description: item.description,
        };
        return acc;
      }, {} as RaffleAdditionalData);
    }
    return undefined;
  }, [rafflesData]);

  return { isRafflesDataLoading, raffleRoundDataMap };
};
