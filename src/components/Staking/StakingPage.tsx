import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Container, Flex, Link, Text } from '@chakra-ui/react';

import { ExportButton } from '@/components/ui/ExportButton/ExportButton';
import { useStakingActions, useStakingUserStakes } from '@/hooks/staking/useStaking';
import { useLogger } from '@/hooks/useLogger';
import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatStakesToExport } from '@/utils/formatters/formatStakesToExport';

import { Staking } from './Staking';
import { StakingTable } from './StakingTable';

export const StakingPage = () => {
  useDocumentTitle('iSaver | Earn by staking');
  useMetaDescription(
    'Stake your SAV or SAVR holdings to earn more SAV. The longer you stake, the more you yield. Accumulate more SAV, so you can increase your governance in the future iSaver DAO'
  );

  const { userStakes } = useStakingUserStakes();
  const { withdraw } = useStakingActions();
  const logger = useLogger({
    event: 'staking',
    category: 'elements',
    action: 'element_click',
    label: 'back',
    buttonLocation: 'up',
    actionGroup: 'interactions',
  });

  const onClaim = useCallback(
    async (planId: number, stakeId: number) => {
      await withdraw.mutateAsync({ planId, stakeId });
    },
    [withdraw]
  );

  const exportData = useCallback(() => {
    const { data, headers } = formatStakesToExport(userStakes);
    exportToExcel('isaver_staking', data, headers);
  }, [userStakes]);

  return (
    <Container variant="dashboard" pt={{ sm: '30px', '2xl': '60px' }}>
      <Link
        as={RouterLink}
        to="/"
        onClick={() => logger()}
        textStyle="button"
        alignSelf="flex-start"
        mb={{ sm: '30px', '2xl': '40px' }}
        ml={{ sm: '10px', md: 'unset' }}
      >
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>

      <Box mb="80px">
        <Staking isPageView />
      </Box>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        paddingX={{ sm: '10px', md: 'unset' }}
      >
        <Text textStyle="h3" textTransform="uppercase" id="stakings-list">
          Your staking
        </Text>

        <ExportButton onClick={exportData} event="staking" buttonLocation="up" />
      </Flex>

      <Box mb="120px">
        <StakingTable stakes={userStakes} onClaim={onClaim} />
      </Box>
    </Container>
  );
};
