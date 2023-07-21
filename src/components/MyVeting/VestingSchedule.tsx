import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import { bigNumberToString } from '@/utils/number';
import { getLocalDateTimeString, getStampsFromDuration } from '@/utils/time';

type VestingScheduleProps = {
  id: number;
  beneficiary?: string;
  cliff: BigNumberish;
  start: BigNumberish;
  duration: BigNumberish;
  slicePeriod: BigNumberish;
  amountTotal: BigNumberish;
  released: BigNumberish;
  releaseAmount?: BigNumberish;
  revocable: boolean;
  revoked: boolean;
  onRevoke?: () => Promise<void>;
  onRelease?: () => Promise<void>;
};
export const VestingSchedule: FC<VestingScheduleProps> = ({
  id,
  beneficiary,
  cliff,
  start,
  duration,
  slicePeriod,
  amountTotal,
  releaseAmount,
  released,
  revocable,
  revoked,
  onRevoke,
  onRelease,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRevoke = useCallback(() => {
    setIsLoading(true);
    onRevoke?.().finally(() => setIsLoading(false));
  }, [onRevoke, setIsLoading]);

  const handleRelease = useCallback(() => {
    setIsLoading(true);
    onRelease?.().finally(() => setIsLoading(false));
  }, [onRelease, setIsLoading]);

  const Label = (props: any) => <Text opacity="0.5" {...props}></Text>;
  const Value = (props: any) => <Text {...props}></Text>;

  const cliffStamps = useMemo(
    () => getStampsFromDuration(BigNumber.from(cliff).sub(start).toNumber() * 1000),
    [cliff, start]
  );
  const durationStamps = useMemo(
    () => getStampsFromDuration(BigNumber.from(duration).toNumber() * 1000),
    [duration]
  );
  const slicePeriodStamps = useMemo(
    () => getStampsFromDuration(BigNumber.from(slicePeriod).toNumber() * 1000),
    [slicePeriod]
  );

  const canRelease = !revoked && onRelease && BigNumber.from(releaseAmount).gt(0);

  return (
    <Box
      textStyle="text1"
      _notFirst={{ mt: '16px' }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="sm"
      padding="8px"
    >
      <Flex alignItems="center" mb="8px">
        <Text mr="12px">Schedule (id: {id})</Text>
        <Text color={!revoked ? 'green.400' : 'red'}>{!revoked ? 'Active' : 'Revoked'}</Text>

        {onRevoke && revocable && !revoked ? (
          <Button
            variant="filledRed"
            width="120px"
            ml="auto"
            size="sm"
            borderRadius="sm"
            isLoading={isLoading}
            onClick={handleRevoke}
          >
            Revoke
          </Button>
        ) : null}

        {onRelease ? (
          <Button
            width="120px"
            ml="auto"
            size="sm"
            borderRadius="sm"
            isLoading={isLoading}
            isDisabled={!canRelease || isLoading}
            onClick={handleRelease}
          >
            Release
          </Button>
        ) : null}
      </Flex>

      {beneficiary ? (
        <Flex mb="8px">
          <Label width="110px">Beneficiary:</Label>
          <Value width="500px">{beneficiary}</Value>
        </Flex>
      ) : null}

      {releaseAmount ? (
        <Flex mb="8px">
          <Label width="180px">Available for release:</Label>
          <Value width="400px">{bigNumberToString(releaseAmount)} SAV</Value>
        </Flex>
      ) : null}

      <Flex mb="8px">
        <Label width="110px">Amount:</Label>
        <Value width="400px">{bigNumberToString(amountTotal)} SAV</Value>
      </Flex>

      <Flex mb="8px">
        <Label width="110px">Released:</Label>
        <Value width="400px">{bigNumberToString(released)} SAV</Value>
      </Flex>

      <Flex mb="8px">
        <Label width="110px">Revocable:</Label>
        <Value width="400px">{revocable ? 'Yes' : 'No'}</Value>
      </Flex>

      <Flex mb="8px">
        <Label width="110px">Start:</Label>
        <Value width="240px">{getLocalDateTimeString(start)}</Value>
      </Flex>

      <Flex mb="8px">
        <Label width="110px">Cliff:</Label>
        <Value width="400px">
          {cliffStamps.days} days - {cliffStamps.hours} hours - {cliffStamps.minutes} mins -{' '}
          {cliffStamps.seconds} secs
        </Value>
      </Flex>

      <Flex mb="8px">
        <Label width="110px">Duration:</Label>
        <Value width="400px">
          {durationStamps.days} days - {durationStamps.hours} hours - {durationStamps.minutes} mins
          - {durationStamps.seconds} secs
        </Value>
      </Flex>

      <Flex mb="8px">
        <Label width="110px">Slice period:</Label>
        <Value width="400px">
          {slicePeriodStamps.days} days - {slicePeriodStamps.hours} hours -{' '}
          {slicePeriodStamps.minutes} mins - {slicePeriodStamps.seconds} secs
        </Value>
      </Flex>
    </Box>
  );
};
