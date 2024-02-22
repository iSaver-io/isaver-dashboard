import { Referral } from '@/types';

import { bigNumberToNumber } from '../number';

export const formatReferralsToExport = (referrals: Referral[]) => {
  const headers = [
    'Level',
    'Referral address',
    'Activation date',
    'SAV balance',
    'SAVR balance',
    'Staking subscription',
    'Referral subscription',
    'Team subscription',
    'Your level subscription',
  ];
  const data = referrals.map((referral) => [
    referral.level,
    referral.referralAddress,
    new Date(referral.activationDate * 1000),
    bigNumberToNumber(referral.savBalance),
    bigNumberToNumber(referral.savrBalance),
    referral.isStakingSubscriptionActive,
    referral.isReferralSubscriptionActive,
    referral.isTeamSubscriptionActive,
    referral.isLevelSubscriptionActive,
  ]);

  return { data, headers };
};
