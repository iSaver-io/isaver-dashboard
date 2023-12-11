import React from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import { RaffleStatusEnum } from '@/utils/formatters/raffle';

import backgroundImage from './assets/raffle_background.svg';
import tokensImage from './assets/tokens.svg';
import tokensMdImage from './assets/tokens_md.svg';
import tokensSmImage from './assets/tokens_sm.svg';
import { RaffleStatus } from './RaffleStatus';

export const RaffleHeading = ({
  status,
  title,
  totalTickets,
}: {
  status: RaffleStatusEnum;
  title: string;
  totalTickets: number;
}) => {
  const bp = useBreakpoint();
  const isSmallStatus = ['sm', 'md', 'lg'].includes(bp);
  const bgImage = bp === 'sm' ? tokensSmImage : bp === 'md' ? tokensMdImage : tokensImage;

  return (
    <Box
      position="relative"
      borderRadius="md"
      overflow="hidden"
      bgSize="cover"
      height={{ sm: '130px', xl: '150px', '2xl': '200px' }}
      padding={{ sm: '20px', xl: '20px 60px', '2xl': '30px 75px' }}
      background={{
        sm: 'linear-gradient(96.85deg, #20735B -8.44%, #1A3435 102.66%)',
        xl: `url(${backgroundImage})`,
      }}
      boxShadow={{ sm: '0px 6px 20px rgba(0, 0, 0, 0.25)', xl: 'unset' }}
    >
      <Box
        position="absolute"
        top="0"
        left={{ sm: '0px', lg: '-20px', xl: '0' }}
        width={{ sm: '46%', md: '60%', lg: '80%', xl: '70%' }}
        height="100%"
        bgImage={bgImage}
        bgSize="cover"
        bgRepeat="no-repeat"
        bgPosition="left center"
        pointerEvents="none"
      />

      <Flex
        height="100%"
        position="relative"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <RaffleStatus status={status} isSmall={isSmallStatus} />

        <Text textTransform="uppercase" textStyle="h3" fontSize={{ sm: '18px', '2xl': '38px' }}>
          {title}
        </Text>

        <Text textStyle="textSansExtraSmall" fontSize={{ '2xl': '26px' }}>
          Total Tickets in this round: {totalTickets}
        </Text>
      </Flex>
    </Box>
  );
};
