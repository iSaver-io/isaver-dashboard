import { useRef } from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import { useOnVisibleLogger } from '@/hooks/logger/useOnVisibleLogger';

import RaffleImg from './images/raffle_img.png';
import RaffleImgSm from './images/raffle_img_sm.png';

import './Landing.scss';

export const Raffle = () => {
  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'md'].includes(bp);

  const ref = useRef<HTMLHeadingElement>(null);
  useOnVisibleLogger(ref, 'our_mini');

  return (
    <Flex
      mb={{ sm: '-60px', lg: '100px', '2xl': '180px' }}
      justifyContent="center"
      flexWrap="wrap"
      className="raffle"
    >
      <Box maxW="1068px" m="auto">
        <Flex flexDirection="column" alignItems="center" mb={{ sm: '30px', lg: '65px' }}>
          <h4 className="heading" ref={ref}>
            Our mini
            {bp === 'sm' ? <br /> : ' '}
            free-to-play
          </h4>
          <h5 className="subheading">As a first step</h5>
        </Flex>

        <Flex direction={{ sm: 'row', lg: 'column' }} width={{ sm: '100vw', lg: 'unset' }}>
          <Box
            position="relative"
            width={{ sm: '60%', lg: '600px', xl: '900px', '2xl': '1000px' }}
            height={{ md: 'unset', lg: '200px', xl: '260px', '2xl': '300px' }}
          >
            <img src={isSm ? RaffleImgSm : RaffleImg} alt="Raffle" className="raffle__img" />
          </Box>
          <Flex
            className="raffle__description"
            justifyContent="space-between"
            alignItems={{ md: 'center', lg: 'end' }}
            mt={{ lg: '16px' }}
            direction={{ sm: 'column', lg: 'row' }}
          >
            <Text className="raffle__text">
              Claim puzzle every day to <br /> get a ticket to the raffle
            </Text>
            <Text
              textStyle="button"
              textAlign="center"
              position="absolute"
              top="35%"
              left="15%"
              display={{ sm: 'block', lg: 'none' }}
            >
              5 DAYS
              <br />=<br />1 TICKET
            </Text>
            <Text className="raffle__heading">Win big prizes</Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};