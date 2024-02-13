import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';

import { ReactComponent as PowerIcon } from './power-icon.svg';

type PowerStatusProps = {
  powerId: number;
  isActive: boolean;
  tip?: string;
};
export const PowerStatus = ({ powerId, isActive, tip }: PowerStatusProps) => {
  const letter = ['A', 'B', 'C', 'D'][powerId];
  let color = ['red', 'green', 'white', 'savr'][powerId];

  if (!isActive) {
    color = 'gray';
  }

  return (
    <Flex alignItems="center">
      <Box color={color}>
        <PowerIcon />
      </Box>

      <Text ml="8px" textColor={color} textStyle="button">
        POWER {letter}
      </Text>
      <Text ml="11px" mr="10px" textColor="white" fontSize="16px" fontWeight={600}>
        {isActive ? 'active' : 'not active'}
      </Text>

      <Tooltip label={tip} fontSize="md" placement="top">
        <Flex
          cursor="default"
          w="17px"
          h="17px"
          borderRadius="50%"
          bgColor="gray.200"
          alignItems="center"
          justifyContent="center"
          fontSize="12px"
        >
          i
        </Flex>
      </Tooltip>
    </Flex>
  );
};
