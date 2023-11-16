import { Link } from 'react-router-dom';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

export const Banner = () => {
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
        <Text textStyle="text1">Instant Win-Win Raffle of various NFTs and SAVR tokens</Text>
      </Box>

      <Box textAlign="center" w="215px">
        <Text textStyle="text1">Get a chance to win an Avatar and Powers</Text>
        <Button as={Link} to="/" mt="15px" w="200px">
          Go
        </Button>
      </Box>
    </Flex>
  );
};