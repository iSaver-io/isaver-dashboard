import { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { TokenVesting } from '@/types.common';
import { waitForTransaction } from '@/utils/waitForTransaction';

const OLD_ABI = [
  {
    inputs: [{ internalType: 'bytes32', name: 'vestingScheduleId', type: 'bytes32' }],
    name: 'computeReleasableAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'vestingScheduleId', type: 'bytes32' }],
    name: 'getVestingSchedule',
    outputs: [
      {
        components: [
          { internalType: 'bool', name: 'initialized', type: 'bool' },
          { internalType: 'address', name: 'beneficiary', type: 'address' },
          { internalType: 'uint256', name: 'cliff', type: 'uint256' },
          { internalType: 'uint256', name: 'start', type: 'uint256' },
          { internalType: 'uint256', name: 'duration', type: 'uint256' },
          { internalType: 'uint256', name: 'slicePeriodSeconds', type: 'uint256' },
          { internalType: 'bool', name: 'revocable', type: 'bool' },
          { internalType: 'uint256', name: 'amountTotal', type: 'uint256' },
          { internalType: 'uint256', name: 'released', type: 'uint256' },
          { internalType: 'bool', name: 'revoked', type: 'bool' },
        ],
        internalType: 'struct TokenVesting.VestingSchedule',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'vestingScheduleId', type: 'bytes32' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'release',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// TODO: DELETE THIS FILE AFTER VESTINGS FINISHED
export const useVestingContract_OLD = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const contractAddress = '0xC63373f8564B92A0bFC4DB0123F065D638863BFF';

  const contract = useContract({
    address: contractAddress,
    abi: OLD_ABI,
    signerOrProvider: signer || provider,
  }) as unknown as TokenVesting;

  const getVestingSchedule = async (id: string) => {
    return contract.getVestingSchedule(id);
  };

  const computeReleasableAmount = async (id: string) => {
    return contract.computeReleasableAmount(id);
  };

  const release = async (scheduleId: string, amount: BigNumber) => {
    const tx = await contract.release(scheduleId, amount);
    return waitForTransaction(tx);
  };

  return {
    contract,
    contractAddress,

    getVestingSchedule,
    computeReleasableAmount,
    release,
  };
};
