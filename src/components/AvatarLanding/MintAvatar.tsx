import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useAvatarPrices, useBuyAvatar, useNextInflationTimestamp } from '@/hooks/useAvatarsSell';

import { ConnectWalletButton } from '../ui/ConnectWalletButton/ConnectWalletButton';

import { Countdown } from './Countdown';

export const MintAvatar = () => {
  const { isConnected } = useAccount();
  const { avatarPrice, avatarNextPrice } = useAvatarPrices();
  const nextInflationTimestamp = useNextInflationTimestamp();
  const buyAvatar = useBuyAvatar();

  const handleBuy = useCallback(() => {
    buyAvatar.mutateAsync();
  }, [buyAvatar]);

  return (
    <Flex flexDirection="column" alignItems="center">
      <Text textStyle="h2" as="h2" textTransform="uppercase" textAlign="center">
        generate your avatar
      </Text>
      {avatarNextPrice && nextInflationTimestamp ? (
        <>
          <Countdown />
          <div className="mint-avatar__line" />
          <Flex
            mt="20px"
            gap={{ base: '10px', lg: '42px' }}
            flexDir={{ base: 'column', lg: 'row' }}
          >
            <Text textStyle="text1">
              <Text as="span" color="gray.200">
                Price Now:
              </Text>{' '}
              {avatarPrice} SAV
            </Text>
            <Text textStyle="text1">
              <Text as="span" color="gray.200">
                Next Price:
              </Text>{' '}
              {avatarNextPrice} SAV
            </Text>
          </Flex>
        </>
      ) : (
        <>
          <Text
            textStyle="h3"
            color="sav"
            mt={{ base: '20px', xl: '50px' }}
            mb={{ base: 0, xl: '10px' }}
          >
            <Text as="span" color="white">
              Price Now:
            </Text>{' '}
            {avatarPrice} SAV
          </Text>
          <div className="mint-avatar__line" />
        </>
      )}
      {isConnected ? (
        <>
          <Button onClick={handleBuy} w="200px" mt={{ base: '30px', lg: '50px' }}>
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
