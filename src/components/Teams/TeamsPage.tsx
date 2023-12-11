import { useCallback, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Container, Flex, Link, Spinner, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';

import { ReferralInfo } from '@/components/Referral/ReferralInfo';
import { ReferralRewardsList } from '@/components/Referral/ReferralRewardsList';
import { ReferralsList } from '@/components/Referral/ReferralsList';
import { Button } from '@/components/ui/Button/Button';
import { StatBlock } from '@/components/ui/StatBlock/StatBlock';
import { useReferralRewards, useUserReferralInfo } from '@/hooks/referral/useReferralManager';
import { useLogger } from '@/hooks/useLogger';
import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';
import { bigNumberToString, getReadableAmount } from '@/utils/number';

import { TeamsList } from './TeamsList';

export const TeamsPage = () => {
  useDocumentTitle('iSaver | Build a team');
  useMetaDescription(
    'Invite your friends and maximize your iSaver Referral Rewards. Earn up to 100% in SAVR from your partners` earnings and additional Rewards when six partners fulfill the specified conditions.'
  );

  const { userReferralInfoRequest } = useUserReferralInfo();
  const { claimDividends } = useReferralRewards();
  const logger = useLogger({
    event: 'team',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'up',
    actionGroup: 'interactions',
  });

  const availableRewards = useMemo(() => {
    const { totalDividends, totalClaimedDividends } = userReferralInfoRequest.data || {};
    if (totalDividends && totalClaimedDividends) {
      return totalDividends.sub(totalClaimedDividends);
    }
    return BigNumber.from(0);
  }, [userReferralInfoRequest.data]);

  const claimRewards = useCallback(() => {
    if (availableRewards.gt(0) && !claimDividends.isLoading) {
      claimDividends.mutate(availableRewards);
      logger({
        action: 'button_click',
        label: 'claim',
        value: bigNumberToString(availableRewards),
        content: 'sav',
        buttonLocation: 'down',
        actionGroup: 'conversions',
      });
    }
  }, [claimDividends, availableRewards, logger]);

  const isClaimDisabled = useMemo(() => availableRewards.eq(0), [availableRewards]);

  return (
    <Container variant="dashboard" pt={{ sm: '30px', '2xl': '60px' }}>
      <Link
        as={RouterLink}
        to="/"
        onClick={() => logger({ label: 'back' })}
        textStyle="button"
        alignSelf="flex-start"
        mb={{ sm: '30px', '2xl': '40px' }}
        ml={{ sm: '10px', md: 'unset' }}
      >
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>

      <Box mb={{ sm: '55px', xl: '40px' }}>
        <ReferralInfo isPageView />
      </Box>

      <Box mb="100px">
        <ReferralsList />
      </Box>

      <Text
        paddingX={{ sm: '10px', md: 'unset' }}
        textStyle="h3"
        textTransform="uppercase"
        mb={{ sm: '20px', lg: '30px' }}
      >
        Your teams
      </Text>

      <Box mb="100px">
        <TeamsList isPageView />
      </Box>

      <Flex
        paddingX={{ sm: '10px', md: 'unset' }}
        justifyContent={{ xl: 'flex-end' }}
        mb={{ sm: '35px', lg: '50px' }}
      >
        <StatBlock
          containerWidth={{ sm: '200px', md: '320px' }}
          leftWidth="320px"
          leftTitle="Available Referral Rewards"
          leftValue={getReadableAmount(availableRewards)}
          leftCurrency="SAVR"
        />

        <Button
          display="block"
          width="150px"
          height="unset"
          ml="10px"
          padding={{ sm: '20px 10px', md: '30px' }}
          bgColor="blue"
          boxShadow="0px 9px 19px rgba(26, 220, 226, 0.3)"
          borderRadius="sm"
          textStyle="button"
          _hover={{
            boxShadow: '0px 12px 22px rgba(26, 220, 226, 0.5)',
            _disabled: { boxShadow: 'none' },
          }}
          transition="all 0.2s"
          isDisabled={isClaimDisabled}
          onClick={claimRewards}
        >
          {claimDividends.isLoading ? <Spinner color="white" thickness="4px" /> : 'Claim'}
        </Button>
      </Flex>

      <Box mb="120px">
        <ReferralRewardsList />
      </Box>
    </Container>
  );
};
