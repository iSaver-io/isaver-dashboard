import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchRoundTitles } from '@/api/fetchRoundTitle';

export type RaffleAdditionalData = Record<number, { title: string; description?: string }>;

export const LOTTERY_ROUND_ADDITIONAL_DATA_REQUEST = 'lottery-addition-data-request';
export const useLotteryRoundAdditionalData = () => {
  const roundTitlesRequest = useQuery({
    queryKey: [LOTTERY_ROUND_ADDITIONAL_DATA_REQUEST],
    queryFn: () => fetchRoundTitles(),
  });

  const raffleRoundDataMap = useMemo(() => {
    if (roundTitlesRequest.data) {
      return roundTitlesRequest.data.records.reduce((acc: RaffleAdditionalData, record: any) => {
        acc[record.fields.id] = {
          title: record.fields.title,
          description: record.fields.description,
        };
        return acc;
      }, {} as RaffleAdditionalData);
    }
    return undefined;
  }, [roundTitlesRequest.data]);

  return { roundTitlesRequest, raffleRoundDataMap };
};
