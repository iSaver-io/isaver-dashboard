import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { useActivatePower, useUserPowers } from '@/hooks/useAvatarSettings';
import { usePowerBalance } from '@/hooks/usePowers';
import { getLocalDateString } from '@/utils/time';

interface PowerCardProps {
  id: number;
  name: string;
  label: string;
  description: string;
  isPowersAllowed?: boolean;
}

export const POWER_SUBSCRIPTION_ENDING_NOTIFICATION = 14 * 24 * 60 * 60; // 14 days in seconds

export const PowerCard = ({ id, name, label, description, isPowersAllowed }: PowerCardProps) => {
  const { activatePower, isLoading } = useActivatePower(id);
  const userPower = useUserPowers(id);
  const balance = usePowerBalance(id);

  const currentTime = Date.now() / 1000;
  const isActive = userPower.toNumber() > currentTime;
  const isEnding =
    isActive && userPower.toNumber() - currentTime < POWER_SUBSCRIPTION_ENDING_NOTIFICATION;

  const getColor = () => {
    switch (id) {
      case 0:
        return 'white';
      case 1:
        return 'sav';
      case 2:
        return 'green.100';
      case 3:
        return 'blue';
      default:
        return 'white';
    }
  };

  return (
    <Flex className="powerCard">
      <Box>
        <Text textStyle="h2" color={getColor()} fontSize={{ sm: '26px', '2xl': '38px' }}>
          {name}
        </Text>
        <Text
          textStyle="h3"
          textTransform="uppercase"
          mt={{ sm: '15px', '2xl': '2px' }}
          fontSize={{ sm: '18px', '2xl': '26px' }}
        >
          {label}
        </Text>
        <Text
          textStyle="note"
          mt={{ sm: '10px', '2xl': '2px' }}
          fontSize={{ sm: '12px', '2xl': '14px' }}
        >
          {description}
        </Text>
      </Box>
      <Box minW={{ sm: '115px', '2xl': '140px' }}>
        {isPowersAllowed ? (
          <>
            {!isEnding && isActive ? (
              <Box textAlign="center">
                <Text textStyle="text2">Active</Text>
                <Text textStyle="note" mt={{ sm: '5px' }}>
                  Until {getLocalDateString(userPower.toNumber())}
                </Text>
              </Box>
            ) : null}
            {!isActive ? (
              <Button
                isDisabled={!balance.toNumber()}
                size="sm"
                onClick={() => activatePower()}
                isLoading={isLoading}
              >
                active
              </Button>
            ) : null}
            {isEnding ? (
              <Box textAlign="center">
                <Button
                  isDisabled={!balance.toNumber()}
                  size="sm"
                  onClick={() => activatePower()}
                  isLoading={isLoading}
                >
                  prolong
                </Button>
                <Text textStyle="note" mt={{ sm: '10px' }}>
                  Until {getLocalDateString(userPower.toNumber())}
                </Text>
              </Box>
            ) : null}
            {balance.toNumber() ? (
              <Box textAlign="center">
                <Text textStyle="text2">You have:</Text>
                <Text textStyle="note" mt={{ sm: '5px' }}>
                  {balance.toString()} items
                </Text>
              </Box>
            ) : null}
          </>
        ) : null}
      </Box>
    </Flex>
  );
};