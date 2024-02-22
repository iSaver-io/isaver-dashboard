import { Box, Flex } from '@chakra-ui/react';

export const StakingParameter = ({
  title,
  children,
  isHighlighted,
}: {
  title: string;
  children: any;
  isHighlighted?: boolean;
}) => {
  return (
    <Flex alignItems="center" color={isHighlighted ? 'green.100' : 'white'}>
      <Box textStyle="textSansExtraSmall" mr="10px" whiteSpace="nowrap">{`${title}`}</Box>
      <Box textStyle="textSansBold" whiteSpace="nowrap">
        {children}
      </Box>
    </Flex>
  );
};
