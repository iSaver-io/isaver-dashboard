import { Box, Text } from '@chakra-ui/react';

import { ReactComponent as CoinsIcon } from './images/banner-coins.svg';

import './Landing.scss';

export const CoinImage = () => {
  return (
    <Box
      width={{ xl: '100%' }}
      minWidth={{ base: '240px', xl: '405px', '2xl': '580px' }}
      textAlign="center"
    >
      <Box
        className="coins-text__img"
        height={{ sm: '160px', md: '240px', lg: '384px', xl: '405px', '2xl': '550px' }}
      >
        <CoinsIcon />
      </Box>
      <Text className="coins-text__primary">500 000 000 SAV</Text>
      <Text className="coins-text__secondary">In staking rewards pool</Text>
    </Box>
  );
};
