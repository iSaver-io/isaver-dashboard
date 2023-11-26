import { Flex, Text } from '@chakra-ui/react';

import { useCountdown } from '@/hooks/useCountdown';

export const Countdown = ({ timestamp }: { timestamp: number }) => {
  const { stamps } = useCountdown(timestamp!);

  return (
    <Flex gap={{ base: '5px', xl: '15px' }}>
      <TimerStamp label="D" value={stamps.days} />
      <Text textStyle="sectionHeading">:</Text>
      <TimerStamp label="H" value={stamps.hours} />
      <Text textStyle="sectionHeading">:</Text>
      <TimerStamp label="M" value={stamps.minutes} />
      <Text textStyle="sectionHeading">:</Text>
      <TimerStamp label="S" value={stamps.seconds} />
    </Flex>
  );
};

const TimerStamp = ({ value, label }: { value: number; label: string }) => {
  return (
    <Text textStyle="sectionHeading">
      <Text color="sav" as="span">
        {value.toString().padStart(2, '0') || '00'}
      </Text>
      {label}
    </Text>
  );
};
