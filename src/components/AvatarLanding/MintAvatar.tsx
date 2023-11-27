import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Flex, Text, useBreakpoint } from '@chakra-ui/react';
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
  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'md', 'lg'].includes(bp);

  const { address: avatarsAddress } = useContractAbi({ contract: ContractsEnum.ISaverAvatars });
  const { hasNFT } = useAddressHasNFT(avatarsAddress, address);

  const handleBuy = useCallback(() => {
    buyAvatar.mutateAsync();
  }, [buyAvatar]);

  return (
    <Flex flexDirection="column" alignItems="center">
      <Text
        mb={{ sm: '20px', md: '30px', '2xl': '50px' }}
        textStyle="h2"
        as="h2"
        fontSize={{ sm: '26px', lg: '36px' }}
        textTransform="uppercase"
        textAlign="center"
        id="mint"
      >
        Generate your
        {isSm ? <br /> : ' '}
        avatar
      </Text>
      {avatarNextPrice && nextInflationTimestamp ? (
        <>
          <Countdown timestamp={nextInflationTimestamp} />
          <div className="mint-avatar__line" />
          <Flex
            mt={{ sm: '15px', xl: '20px' }}
            gap={{ sm: '10px', xl: '42px' }}
            flexDir={{ sm: 'column-reverse', xl: 'row' }}
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
            mt={{ sm: '30px', xl: '50px' }}
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
        <ConnectWalletButton mt={{ sm: '30px', xl: '50px' }} />
      )}
    </Flex>
  );
};
