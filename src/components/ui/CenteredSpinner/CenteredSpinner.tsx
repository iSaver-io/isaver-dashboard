import { FC } from 'react';
import { Box, Center, Spinner } from '@chakra-ui/react';

type CenteredSpinnerProps = {
  color?: string;
  background?: string;
};
export const CenteredSpinner: FC<CenteredSpinnerProps> = ({
  color = 'green.400',
  background = 'rgba(13, 35, 16, 0.3)',
}) => {
  return (
    <Box
      position="absolute"
      left="0"
      top="0"
      width="100%"
      height="100%"
      background={background}
      zIndex="30"
    >
      <Center height="100%">
        <Spinner size="xl" color={color} thickness="4px" />
      </Center>
    </Box>
  );
};
