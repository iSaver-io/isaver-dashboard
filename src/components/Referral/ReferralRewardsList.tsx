import React, { useCallback, useMemo, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import { SearchWallet } from '@/components/ui/SearchWallet/SearchWallet';
import { useReferralRewards } from '@/hooks/referral/useReferralManager';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatReferralRewardsToExport } from '@/utils/formatters/formatReferralRewardsToExport';

import { ExportButton } from '../ui/ExportButton/ExportButton';

import { ReferralRewardsTable } from './ReferralRewardsTable';

export const ReferralRewardsList = () => {
  const [search, setSearch] = useState<string>('');

  const { referralRewards } = useReferralRewards();

  const filteredRewards = useMemo(
    () =>
      (referralRewards || []).filter((reward) =>
        reward.referral?.toLowerCase().includes(search.toLowerCase())
      ),
    [referralRewards, search]
  );

  const exportData = useCallback(() => {
    const { data, headers } = formatReferralRewardsToExport(referralRewards);
    exportToExcel('isaver_referral_rewards', data, headers);
  }, [referralRewards]);

  return (
    <>
      <Flex
        paddingX={{ sm: '10px', md: 'unset' }}
        justifyContent="space-between"
        alignItems="center"
        mb={{ sm: '4px', xl: '18px' }}
      >
        <Text
          textStyle="h3"
          id="ref-rewards-list"
          whiteSpace="nowrap"
          textTransform="uppercase"
          fontWeight={{ sm: '600', xl: '700' }}
          fontSize={{ sm: '14px', md: '18px', xl: '26px' }}
        >
          Your referral rewards
        </Text>

        <Flex alignItems="center">
          <Box mr={{ sm: '0px', xl: '10px' }}>
            <SearchWallet
              buttonText="Search wallet"
              event="team"
              buttonLocation="down"
              onChange={setSearch}
            />
          </Box>
          <ExportButton onClick={exportData} event="team" buttonLocation="down" />
        </Flex>
      </Flex>

      <ReferralRewardsTable rewards={filteredRewards} />
    </>
  );
};
