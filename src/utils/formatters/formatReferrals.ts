import { BigNumber } from 'ethers';

import { RawReferral, Referral } from '@/types';

export const formatReferrals = (referrals: RawReferral[], userLevels: BigNumber[]): Referral[] => {
  const hasSubscription = (level: number) =>
    userLevels.length > level && userLevels[level].toNumber() > Date.now() / 1000;

  return referrals.map((referral) => ({
    level: referral.level.toNumber(),
    referralAddress: referral.referralAddress,
    activationDate: referral.activationDate.toNumber(),
    savBalance: referral.token1Balance,
    savrBalance: referral.token2Balance,
    isStakingSubscriptionActive: referral.isStakingSubscriptionActive,
    isReferralSubscriptionActive: referral.isReferralSubscriptionActive,
    isSquadSubscriptionActive: referral.isSquadSubscriptionActive,
    isLevelSubscriptionActive: hasSubscription(referral.level.toNumber() - 1),
  }));
};
