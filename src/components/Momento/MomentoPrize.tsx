import { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';

import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { PrizeInfo, useGetNFT } from '@/hooks/useMomento';
import alchemy from '@/modules/alchemy';

import otherPrize from './images/other-prize.png';
import powerAPrize from './images/powers/a.png';
import powerBPrize from './images/powers/b.png';
import powerCPrize from './images/powers/c.png';
import powerDPrize from './images/powers/d.png';
import prizeBackground from './images/prize-background.png';
import savrPrize from './images/savr-prize.png';
import ticketPrize from './images/ticket-prize.png';

interface MomentoPrizeProps {
  prizeInfo: PrizeInfo;
}

export const MomentoPrize = ({ prizeInfo }: MomentoPrizeProps) => {
  const contracts = useContractsAddresses();

  const renderPrize = useCallback(() => {
    if (prizeInfo.isERC721) {
      return <NFT tokenId={prizeInfo.tokenId} tokenAddress={prizeInfo.tokenAddress} />;
    }

    switch (prizeInfo.tokenAddress) {
      case contracts.ISaverSAVRToken:
        return <SavrTokens amount={prizeInfo.amount} />;
      case contracts.ISaverPowers:
        return <Powers tokenId={prizeInfo.tokenId} />;
      case contracts.Ticket:
        return <Ticket amount={prizeInfo.amount} />;
      default:
        return <OtherTokens amount={prizeInfo.amount} tokenAddress={prizeInfo.tokenAddress} />;
    }
  }, [contracts.ISaverPowers, contracts.ISaverSAVRToken, contracts.Ticket, prizeInfo]);

  return (
    <Flex
      mt={{ base: '30px', lg: '75px' }}
      h={{ base: '150px', md: '220px', lg: '270px', xl: '460px' }}
      bgImage={prizeBackground}
      bgPosition="center center"
      bgSize="contain"
      bgRepeat="no-repeat"
      justifyContent="center"
      alignItems="center"
    >
      <Box className="momento_prize">{renderPrize()}</Box>
    </Flex>
  );
};

const SavrTokens = ({ amount }: Pick<PrizeInfo, 'amount'>) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      pos="relative"
      h="100%"
      w="100%"
    >
      <Image src={savrPrize} alt="SAVR" pos="absolute" left="0" top="0" />
      <Text
        fontWeight="black"
        fontSize={{ base: '20px', lg: '48px', xl: '84px' }}
        lineHeight="1"
        zIndex={10}
      >
        {amount.toString()}
      </Text>
      <Text
        fontWeight="black"
        fontSize={{ base: '16px', lg: '32px', xl: '52px' }}
        lineHeight="1"
        zIndex={10}
      >
        SAVR
      </Text>
    </Flex>
  );
};

const Powers = ({ tokenId }: Pick<PrizeInfo, 'tokenId'>) => {
  const powerPrizes: Record<number, any> = {
    1: powerAPrize,
    2: powerBPrize,
    3: powerCPrize,
    4: powerDPrize,
  };

  return (
    <Flex justifyContent="center" alignItems="center" h="100%" w="100%">
      <Image src={powerPrizes[Number(tokenId)]} alt="SAVR" />
    </Flex>
  );
};

const NFT = ({ tokenId, tokenAddress }: Pick<PrizeInfo, 'tokenId' | 'tokenAddress'>) => {
  const { nft } = useGetNFT(tokenAddress, Number(tokenId));

  return (
    <Flex justifyContent="center" alignItems="center" h="100%" w="100%">
      <Image src={nft?.image.originalUrl} alt={nft?.name} />
    </Flex>
  );
};

const Ticket = ({ amount }: Pick<PrizeInfo, 'amount'>) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      pos="relative"
      h="100%"
      w="100%"
    >
      <Image src={ticketPrize} alt="ticket" />
      <Text
        fontWeight="black"
        fontSize={{ base: '20px', lg: '48px', xl: '84px' }}
        lineHeight="1"
        zIndex={10}
        pos="absolute"
        right={0}
        bottom={0}
      >
        x{amount.toString()}
      </Text>
    </Flex>
  );
};

const OtherTokens = ({ amount, tokenAddress }: Pick<PrizeInfo, 'amount' | 'tokenAddress'>) => {
  const [symbol, setSymbol] = useState<string | null>(null);

  useEffect(() => {
    const fetchSymbol = async () => {
      const tokenMetadata = await alchemy.core.getTokenMetadata(tokenAddress);
      setSymbol(tokenMetadata.symbol);
    };

    fetchSymbol();
  }, [tokenAddress]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      pos="relative"
      h="100%"
      w="100%"
    >
      <Image src={otherPrize} alt="SAVR" pos="absolute" left="0" top="0" />
      <Text
        fontWeight="black"
        fontSize={{ base: '20px', lg: '48px', xl: '84px' }}
        lineHeight="1"
        zIndex={10}
      >
        {amount.toString()}
      </Text>
      <Text
        fontWeight="black"
        fontSize={{ base: '16px', lg: '32px', xl: '52px' }}
        lineHeight="1"
        zIndex={10}
      >
        {symbol}
      </Text>
    </Flex>
  );
};
