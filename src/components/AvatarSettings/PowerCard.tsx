import { useCallback } from 'react';
import { Box, Button, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import { useActivatePower, useUserPowers } from '@/hooks/useAvatarSettings';
import { useLogger } from '@/hooks/useLogger';
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
  const { power, isActive, isEnding } = useUserPowers(id);
  const balance = usePowerBalance(id);
  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'xl'].includes(bp);
  const logger = useLogger({
    event: 'settings',
    category: 'elements',
    action: 'button_click',
    content: `Power ${name}`,
    buttonLocation: 'down',
    actionGroup: 'conversions',
    context: 'powers',
  });

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

  const handleActivate = useCallback(
    (isProlong: boolean) => {
      logger({ label: isProlong ? 'prolong' : 'activate' });
      activatePower();
    },
    [logger, activatePower]
  );

  return (
    <Flex className="powerCard">
      <Box>
        <Text textStyle="h2" color={getColor()} fontSize={isSm ? '26px' : '38px'}>
          {name}
        </Text>
        <Text
          textStyle="h3"
          textTransform="uppercase"
          mt={isSm ? '15px' : '2px'}
          fontSize={isSm ? '18px' : '26px'}
        >
          {label}
        </Text>
        <Text
          textStyle="note"
          mt={isSm ? '10px' : '2px'}
          fontSize="12px"
          dangerouslySetInnerHTML={{ __html: description }}
        ></Text>
      </Box>
      <Box minW={isSm ? '115px' : '140px'}>
        {isPowersAllowed ? (
          <>
            {!isEnding && isActive ? (
              <Box textAlign="center">
                <Text textStyle="text2" fontSize="12px">
                  Active
                </Text>
                <Text textStyle="note" fontSize="12px" mt="8px">
                  Until {getLocalDateString(power)}
                </Text>
              </Box>
            ) : null}
            {!isActive ? (
              <Button
                isDisabled={!balance.toNumber()}
                size="md"
                onClick={() => handleActivate(false)}
                isLoading={isLoading}
              >
                Activate
              </Button>
            ) : null}
            {isEnding ? (
              <Box textAlign="center">
                <Button
                  isDisabled={!balance.toNumber()}
                  size="md"
                  onClick={() => handleActivate(true)}
                  isLoading={isLoading}
                >
                  Prolong
                </Button>
                <Text textStyle="note" fontSize="12px" mt={isSm ? '10px' : '15px'}>
                  Until {getLocalDateString(power)}
                </Text>
              </Box>
            ) : null}
            <Box textAlign="center">
              <Text textStyle="text2" fontSize="16px" fontWeight="600">
                You have:
              </Text>
              <Text textStyle="note" fontSize="12px" mt="5px">
                {balance.toString()} items
              </Text>
            </Box>
          </>
        ) : null}
      </Box>
    </Flex>
  );
};
