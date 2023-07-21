import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { bigNumberToString } from '@/utils/number';

import { useVestingContract, VestingScheduleProps } from './contracts/useVestingContract';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';

const ALL_VESTING_SCHEDULES_REQUEST = 'all-vesting-schedules-request';
const VESTING_SCHEDULES_BY_BENEFICIARY_REQUEST = 'vesting-schedules-by-beneficiary-request';
export const useVesting = () => {
  const vestingContract = useVestingContract();
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { success, handleError } = useNotification();

  const vestingSchedules = useQuery([ALL_VESTING_SCHEDULES_REQUEST], async () => {
    return await vestingContract.getVestingSchedules();
  });

  const myVestingSchedules = useQuery(
    [VESTING_SCHEDULES_BY_BENEFICIARY_REQUEST, address],
    async () => {
      if (!address) {
        return;
      }
      return await vestingContract.getVestingSchedulesByBeneficiary(address);
    },
    { enabled: Boolean(address) }
  );

  const releaseVestedTokens = useMutation(
    ['release-vested-tokens'],
    async ({ scheduleId, amount }: { scheduleId: number; amount: BigNumber }) => {
      const txHash = await vestingContract.release(scheduleId, amount);
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
      onError: handleError,
    }
  );

  const revokeSchedule = useMutation(
    ['revoke-schedule'],
    async (scheduleId: number) => {
      const txHash = await vestingContract.revoke(scheduleId);
      success({ title: 'Success', description: 'Vesting schedule revoked', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([ALL_VESTING_SCHEDULES_REQUEST]);
      },
      onError: handleError,
    }
  );

  const createVestingSchedules = useMutation(
    ['create-vesting-schedule'],
    async (props: VestingScheduleProps) => {
      const txHash = await vestingContract.createVestingSchedules(props);
      success({ title: 'Success', description: 'Vesting schedule has been created', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([ALL_VESTING_SCHEDULES_REQUEST]);
      },
      onError: handleError,
    }
  );

  return {
    vestingSchedules,
    myVestingSchedules,
    releaseVestedTokens,
    revokeSchedule,
    createVestingSchedules,
  };
};
