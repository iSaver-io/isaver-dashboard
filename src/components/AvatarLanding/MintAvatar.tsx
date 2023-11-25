import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ContractsEnum, useContractAbi } from '@/hooks/contracts/useContractAbi';
import { useAvatarPrices, useBuyAvatar, useNextInflationTimestamp } from '@/hooks/useAvatarsSell';
import { useAddressHasNFT } from '@/hooks/useNFTHolders';

import { ConnectWalletButton } from '../ui/ConnectWalletButton/ConnectWalletButton';

import { Countdown } from './Countdown';

export const MintAvatar = () => {
  const { isConnected, address } = useAccount();
  const { avatarPrice, avatarNextPrice } = useAvatarPrices();
  const nextInflationTimestamp = useNextInflationTimestamp();
  const buyAvatar = useBuyAvatar();

  const { address: avatarsAddress } = useContractAbi({ contract: ContractsEnum.ISaverAvatars });
  const { hasNFT } = useAddressHasNFT(avatarsAddress, address);

  const handleBuy = useCallback(() => {
    buyAvatar.mutateAsync();
  }, [buyAvatar]);

  return (
    <Flex flexDirection="column" alignItems="center">
      <Text textStyle="h2" as="h2" textTransform="uppercase" textAlign="center" id="mint">
        Generate your avatar
      </Text>
      {avatarNextPrice && nextInflationTimestamp ? (
        <>
          <Countdown timestamp={nextInflationTimestamp} />
          <div className="mint-avatar__line" />
          <Flex
            mt="20px"
            gap={{ base: '10px', lg: '42px' }}
            flexDir={{ base: 'column', lg: 'row' }}
            alignItems="center"
          >
            <Flex flexDirection="row" gap="15px" flexWrap="nowrap" alignItems="center">
              <Text as="span">Price Now:</Text>
              <Text as="span" textStyle="h3">
                {avatarPrice} SAV
              </Text>
            </Flex>
            <Flex flexDirection="row" gap="15px" flexWrap="nowrap" alignItems="center">
              <Text as="span" color="gray.200">
                Next Price:
              </Text>{' '}
              <Text as="span" textStyle="text1">
                {avatarNextPrice} SAV
              </Text>
            </Flex>
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
          <Button
            onClick={handleBuy}
            isLoading={buyAvatar.isLoading}
            w="200px"
            mt={{ base: '30px', lg: '50px' }}
          >
            Mint now
          </Button>
          {hasNFT ? (
            <Button variant="outlinedWhite" as={Link} to="/" mt="10px" w="200px">
              Activate
            </Button>
          ) : null}
        </>
      ) : (
        <ConnectWalletButton mt={{ base: '30px', lg: '50px' }} />
      )}
    </Flex>
  );
};
