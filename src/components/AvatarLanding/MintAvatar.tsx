import { Link } from 'react-router-dom';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ConnectWalletButton } from '../ui/ConnectWalletButton/ConnectWalletButton';

import { Countdown } from './Countdown';

export const MintAvatar = () => {
  const { isConnected } = useAccount();

  return (
    <Flex flexDirection="column" alignItems="center">
      <Text textStyle="h2" as="h2" textTransform="uppercase" textAlign="center">
        generate your avatar
      </Text>
      <Countdown />
      <div className="mint-avatar__line" />
      <Flex mt="20px" gap={{ base: '10px', lg: '42px' }} flexDir={{ base: 'column', lg: 'row' }}>
        <Text textStyle="text1">
          <Text as="span" color="gray.200">
            Price Now:
          </Text>{' '}
          0.000 SAV
        </Text>
        <Text textStyle="text1">
          <Text as="span" color="gray.200">
            Next Price:
          </Text>{' '}
          0.000 SAV
        </Text>
      </Flex>
      {isConnected ? (
        <>
          <Button as={Link} to="/" w="200px" mt={{ base: '30px', lg: '50px' }}>
            Mint now
          </Button>
          <Button variant="outlinedWhite" as={Link} to="/" mt="10px" w="200px">
            Activate
          </Button>
        </>
      ) : (
        <ConnectWalletButton mt={{ base: '30px', lg: '50px' }} />
      )}
    </Flex>
  );
};
