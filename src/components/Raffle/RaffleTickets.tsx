import { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';

import puzzlePattern from './assets/puzzle_pattern.svg';

type RaffleTicketsProps = {
  tickets: number;
  onBuyClick: () => void;
};
export const RaffleTickets: FC<RaffleTicketsProps> = ({ tickets, onBuyClick }) => {
  return (
    <Box
      bgColor="bgGreen.50"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      overflow="hidden"
    >
      <Box
        padding={{ sm: '13px 10px 20px', '2xl': '36px 40px' }}
        bgImage={puzzlePattern}
        bgSize="cover"
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          direction={{ sm: 'column', '2xl': 'row' }}
        >
          <Flex alignItems="center">
            <Text
              textStyle="text1"
              fontSize={{ sm: '16px', '2xl': '26px' }}
              fontWeight={{ sm: '500', '2xl': '600' }}
            >
              Your Tickets:
            </Text>
            <Text
              textStyle="text1"
              ml={{ sm: '15px', '2xl': '20px' }}
              lineHeight={{ sm: '20px', '2xl': '50px' }}
              fontSize={{ sm: '26px', '2xl': '55px' }}
              fontWeight={{ sm: '500', '2xl': '400' }}
            >
              {tickets}
            </Text>
          </Flex>
          <Button
            width={{ sm: '100%', '2xl': 'unset' }}
            mt={{ sm: '15px', '2xl': 'unset' }}
            onClick={onBuyClick}
          >
            Buy Tickets
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
