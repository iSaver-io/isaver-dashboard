import React from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import { ReactComponent as BlueboxIcon } from './images/bluebox.svg';
import { ReactComponent as GreenboxIcon } from './images/greenbox.svg';

import './Landing.scss';

export const About = () => {
  const bp = useBreakpoint({ ssr: false });
  const isXl = bp === 'xl';
  const isBig = ['2xl'].includes(bp);

  return (
    <Flex className="about-container">
      <Flex
        alignItems="center"
        justifySelf="center"
        width="100%"
        maxWidth={{ xl: '1000px', '2xl': 'unset' }}
        justifyContent="center"
      >
        <Box className="about-container__img" data-atrr={useBreakpoint()}>
          <BlueboxIcon height={isXl ? '304px' : '594px'} />
        </Box>
        <Flex
          className="heading-container"
          flexWrap="wrap"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          maxW={{ base: '820px', '2xl': '855px' }}
        >
          <h4 className="heading">About Isaver</h4>
          <h5 className="subheading">
            Decentralized Finance made easy
            <br />
            and accessible for everyone
          </h5>
          <Text className="text" textAlign="center" px={{ sm: '24px', '2xl': '0' }}>
            iSaver is a DeFi platform on the Polygon blockchain that helps its users to generate
            sustainable passive income through Staking Pools based on SAV and SAVR tokens. Discover
            our ecosystem, where everyone can maximize the potential of their capital. Explore a
            range of iSaver Avatars benefits that complement the staking capabilities. And
            Multi-level Referral Program additionally rewards active participants. Be sure to join
            iSaver Raffles for a chance to win exciting prizes! Our Mission is to adopt millions of
            users to DeFi.
          </Text>
        </Flex>
        <Box className="about-container__img">
          <GreenboxIcon height={isXl ? '304px' : '605px'} />
        </Box>
      </Flex>
    </Flex>
  );
};
