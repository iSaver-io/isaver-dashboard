import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Center, Container, Flex, Link, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useDocumentTitle } from '@/hooks/useMeta';
import { useVesting } from '@/hooks/useVesting';
import { useVesting_OLD } from '@/hooks/useVesting_OLD';

import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';
import { ConnectWalletButton } from '../ui/ConnectWalletButton/ConnectWalletButton';

import { VestingSchedule } from './VestingSchedule';

export const MyVesting = () => {
  useDocumentTitle('iSaver | My Vesting Schedules');

  const { isConnected, address } = useAccount();
  const { myVestingSchedules, releaseVestedTokens } = useVesting();
  const { myVestingSchedules_OLD, releaseVestedTokens_OLD } = useVesting_OLD();

  const totalVestings =
    (myVestingSchedules.data?.length || 0) + (myVestingSchedules_OLD.data?.length || 0);

  if (!isConnected) {
    return (
      <Box height="95vh" position="relative">
        <Center height="100%">
          <ConnectWalletButton />
        </Center>
      </Box>
    );
  }

  return (
    <Container variant="dashboard" pt={{ sm: '30px', '2xl': '60px' }}>
      <Link
        as={RouterLink}
        to="/"
        textStyle="button"
        alignSelf="flex-start"
        mb={{ sm: '30px', '2xl': '40px' }}
      >
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>

      <Text textStyle="sectionHeading" mb="20px">
        Vesting Schedules ({totalVestings})
      </Text>

      <Box minHeight="300px" position="relative">
        {myVestingSchedules.isLoading ? <CenteredSpinner background="transparent" /> : null}

        {!myVestingSchedules.isLoading && !myVestingSchedules.data ? (
          <Flex alignItems="center" justifyContent="center">
            <Text textStyle="text1" fontSize="22px" textAlign="center" color="gray">
              No vesting schedules for your account: {address}
            </Text>
          </Flex>
        ) : null}

        <Box mt="16px" mb="32px">
          {myVestingSchedules.data?.map((vesting) => (
            <VestingSchedule
              key={vesting.id.toNumber()}
              id={vesting.id.toNumber()}
              cliff={vesting.schedule.cliff}
              start={vesting.schedule.start}
              duration={vesting.schedule.duration}
              slicePeriod={vesting.schedule.slicePeriodSeconds}
              amountTotal={vesting.schedule.amountTotal}
              released={vesting.schedule.released}
              revocable={vesting.schedule.revocable}
              revoked={vesting.schedule.revoked}
              releaseAmount={vesting.releaseAmount}
              onRelease={() =>
                releaseVestedTokens.mutateAsync({
                  scheduleId: vesting.id.toNumber(),
                  amount: vesting.releaseAmount,
                })
              }
            />
          ))}
          {/* TODO: DELETE THIS AFTER VESTING ENDS */}
          {myVestingSchedules_OLD.data?.map((vesting) => (
            <VestingSchedule
              key={vesting.id.toNumber()}
              id={vesting.id.toNumber()}
              cliff={vesting.schedule.cliff}
              start={vesting.schedule.start}
              duration={vesting.schedule.duration}
              slicePeriod={vesting.schedule.slicePeriodSeconds}
              amountTotal={vesting.schedule.amountTotal}
              released={vesting.schedule.released}
              revocable={vesting.schedule.revocable}
              revoked={vesting.schedule.revoked}
              releaseAmount={vesting.releaseAmount}
              onRelease={() =>
                releaseVestedTokens_OLD.mutateAsync({
                  scheduleId: vesting.id.toNumber(),
                  amount: vesting.releaseAmount,
                })
              }
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};
