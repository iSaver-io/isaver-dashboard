import { useMemo } from 'react';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { bigNumberToString } from '@/utils/number';

import { useVestingContract_OLD } from './contracts/useVestingContract_OLD';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';

const VESTING_SCHEDULES_BY_BENEFICIARY_REQUEST = 'old_vesting-schedules-by-beneficiary-request';

const VESTING_IDS_MAP: Record<`0x${string}`, string[]> = {
  '0x895eA613AA290085d7d1C16B8152b5FD0D603E42': [
    '0x0152156da3edf8b36dfc967b3cdacc466a48c4a896f2170f79cc5bcb00d50088',
  ],
  '0xAE825D148c20f003cD0EEA979DD9aa9ED828ffb5': [
    '0x3f261c8f6b8ca5d9f66dc4e9e9a46a58a3aa13b01bcf3fbcbc1cd02ec571a043',
    '0x78dae391765ff83fdf41750ff4b63da64ab4ebd5502839502db2b03ff6b95e87',
    '0x7dbb09e83020cedeff218b6d2c49063a7b91fe87e1f927656ccd43bf99733242',
    '0xfc87900bd88ef4ebf1244e914c76dca8b16d6163e0239ac8cddcaa678d85f87b',
    '0x449833104c3b6d70128cb88abd72f0ea3af7f31852b6cbda7e130a416f8ed554',
  ],
};
export const useVesting_OLD = () => {
  const vestingContract = useVestingContract_OLD();
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { success, handleError } = useNotification();

  const vestingIds = address ? VESTING_IDS_MAP[address] : null;

  const myVestingSchedulesRequest_OLD = useQueries({
    queries: (vestingIds || []).map((id, index) => ({
      queryKey: ['old_vesting-schedules-by-beneficiary-request', id],
      queryFn: async () => {
        const schedule = await vestingContract.getVestingSchedule(id);
        const releaseAmount = await vestingContract.computeReleasableAmount(id);

        const data = {
          id: BigNumber.from(index),
          schedule,
          releaseAmount,
        };

        return data;
      },
    })),
  });

  const myVestingSchedules_OLD = useMemo(() => {
    // @ts-ignore
    const data: { id: BigNumber; schedule: any; releaseAmount: BigNumber }[] =
      myVestingSchedulesRequest_OLD.map((request) => request.data).filter(Boolean);
    return { data };
  }, [myVestingSchedulesRequest_OLD]);

  const releaseVestedTokens_OLD = useMutation(
    ['release-vested-tokens_old'],
    async ({ scheduleId, amount }: { scheduleId: number; amount: BigNumber }) => {
      if (!vestingIds) return;

      const id = vestingIds[scheduleId];
      const txHash = await vestingContract.release(id, amount);
      success({
        title: 'Success',
        description: `${bigNumberToString(amount)} SAV tokens released`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([VESTING_SCHEDULES_BY_BENEFICIARY_REQUEST]);
        queryClient.invalidateQueries([SAV_BALANCE_REQUEST]);
      },
      onError: (err) => handleError(err),
    }
  );

  return {
    myVestingSchedules_OLD,
    releaseVestedTokens_OLD,
  };
};
