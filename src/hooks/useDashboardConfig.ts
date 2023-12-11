import { useMemo } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { configDoc } from '@/modules/firebase';

export const useDashboardConfig = () => {
  const [configData, isConfigLoading, configError] = useDocumentData(configDoc);

  if (configError) {
    console.error('configError', configError);
  }

  const isExchangeSellEnabled = useMemo(
    () => (configData ? (configData?.isExchangeSellEnabled as boolean) : false),
    [configData]
  );

  const topNotification = useMemo(
    () => (configData ? (configData?.topNotification as string) : undefined),
    [configData]
  );

  return { isConfigLoading, isExchangeSellEnabled, topNotification };
};
