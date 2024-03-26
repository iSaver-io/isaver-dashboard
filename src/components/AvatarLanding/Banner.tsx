import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { useLogger } from '@/hooks/useLogger';

export const Banner = () => {
  const navigate = useNavigate();
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
    navigate('/momento');
  }, [logger, navigate]);

  return (
    <Flex
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
