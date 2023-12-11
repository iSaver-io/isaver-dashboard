import React, { useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';

import { RaffleStatusEnum } from '@/utils/formatters/raffle';

export const RaffleStatus = ({
  status,
  isSmall,
  noBorder,
}: {
  status: RaffleStatusEnum;
  isSmall?: boolean;
  noBorder?: boolean;
}) => {
  const statusColor = useMemo(() => {
    if (status === RaffleStatusEnum.upcoming) return 'yellow.200';
    if (status === RaffleStatusEnum.current) return 'green.400';
    if (status === RaffleStatusEnum.soldOut) return 'red';
    if (status === RaffleStatusEnum.closed) return 'red';
    return 'white';
  }, [status]);

  if (noBorder) {
    return (
      <Text textStyle="button" color={statusColor}>
        {status}
      </Text>
    );
  }

  return (
    <Box
      display="inline-block"
      padding={isSmall ? '6px 30px' : '10px 30px'}
      border="2px solid"
      borderColor={statusColor}
      borderRadius="md"
      textStyle="button"
      fontSize={isSmall ? '12px' : undefined}
      color={statusColor}
    >
      {status}
    </Box>
  );
};
