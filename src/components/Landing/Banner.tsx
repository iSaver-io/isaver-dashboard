import { useCallback } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

import { useLogger } from '@/hooks/useLogger';
import { APP_URL } from '@/router';

import './Landing.scss';

export const Banner = () => {
  const logger = useLogger();

  const handleGetStartedClick = useCallback(() => {
    logger({
      event: 'landing',
      category: 'elements',
      action: 'button_click',
      label: 'get_started',
      buttonLocation: 'down',
      actionGroup: 'interactions',
    });
    window.open(APP_URL, '_self');
  }, [logger]);

  return (
    <Flex justifyContent="center" flexWrap="wrap" className="banner">
      <Box maxW="1260px" m="auto">
        <h4 className="banner__heading">No&nbsp;registration, no&nbsp;KYC, no&nbsp;hassle</h4>
        <h5 className="banner__subheading">Just by connecting your wallet</h5>
        <Flex justifyContent="center">
          <Button variant="primary" className="banner__btn" onClick={handleGetStartedClick}>
            Get started
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
