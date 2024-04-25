import { useCallback, useRef } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { useOnVisibleLogger } from '@/hooks/logger/useOnVisibleLogger';
import { useLogger } from '@/hooks/useLogger';
import { APP_URL } from '@/router';

export const Banner = () => {
  const ref = useRef(null);
  const logger = useLogger({
    event: 'avatars',
    category: 'banners',
    action: 'click',
    buttonLocation: 'down',
    actionGroup: 'interactions',
    context: 'avatars',
  });
  const handleOpenMomento = useCallback(() => {
    logger({ label: 'momento' });
    window.open(APP_URL + '/momento', '_self');
  }, [logger]);

  useOnVisibleLogger(ref, {
    event: 'avatars',
    category: 'banners',
    action: 'show',
    label: 'momento',
    context: 'avatars',
    buttonLocation: 'down',
    actionGroup: 'interactions',
  });

  return (
    <Flex
      ref={ref}
      className="banner"
      justifyContent={{ base: 'flex-start', xl: 'space-between' }}
      alignItems="center"
    >
      <Box w="305px" textAlign={{ base: 'center', xl: 'left' }}>
        <Text textStyle="sectionHeading" as="h2">
          momento
        </Text>
        <Text textStyle="text1" mt={{ sm: '20px', md: '15px', xl: '5px' }}>
          Instant Win-Win Raffle of various NFTs and SAVR tokens
        </Text>
      </Box>

      <Box textAlign="center" w="215px" mt={{ sm: '25px', md: '30px', xl: 'unset' }}>
        <Text textStyle="text1">Get a chance to win an&nbsp;Avatar and Powers</Text>
        <Button mt="15px" w="200px" onClick={handleOpenMomento}>
          Go
        </Button>
      </Box>
    </Flex>
  );
};
