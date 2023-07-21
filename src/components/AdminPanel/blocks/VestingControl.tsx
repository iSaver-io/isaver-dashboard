import { Box, useDisclosure } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { CreateVestingSchedule } from '@/components/AdminPanel/common/CreateVestingSchedule';
import { VestingSchedule } from '@/components/MyVeting/VestingSchedule';
import { Button } from '@/components/ui/Button/Button';
import { useVesting } from '@/hooks/useVesting';

export const VestingControl = () => {
  const { vestingSchedules, revokeSchedule, createVestingSchedules } = useVesting();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AdminSection title="Vesting" isLoading={vestingSchedules.isLoading}>
      <Box>
        <Button size="sm" onClick={onOpen}>
          Create new Vesting schedule
        </Button>

        {isOpen ? (
          <CreateVestingSchedule onClose={onClose} onSubmit={createVestingSchedules.mutateAsync} />
        ) : null}

        <Box mt="16px" maxHeight="400px" overflowY="auto">
          {vestingSchedules.data?.map((schedule, index) => (
            <VestingSchedule
              key={index}
              id={index}
              beneficiary={schedule.beneficiary}
              cliff={schedule.cliff}
              start={schedule.start}
              duration={schedule.duration}
              slicePeriod={schedule.slicePeriodSeconds}
              amountTotal={schedule.amountTotal}
              released={schedule.released}
              revocable={schedule.revocable}
              revoked={schedule.revoked}
              onRevoke={() => revokeSchedule.mutateAsync(index)}
            />
          ))}
        </Box>
      </Box>
    </AdminSection>
  );
};
