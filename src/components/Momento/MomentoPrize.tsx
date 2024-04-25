import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { useLogger } from '@/hooks/useLogger';
import { PrizeInfo, useGetNFT } from '@/hooks/useMomento';
import alchemy from '@/modules/alchemy';
import { getTokenNameByAddress } from '@/utils/logger';
import { bigNumberToString } from '@/utils/number';

import otherPrize from './images/other-prize.png';
import powerAPrize from './images/powers/a.png';
import powerBPrize from './images/powers/b.png';
import powerCPrize from './images/powers/c.png';
import powerDPrize from './images/powers/d.png';
import prizeBackground2XL from './images/prize-background-2xl.png';
import prizeBackgroundLG from './images/prize-background-lg.png';
import prizeBackgroundMD from './images/prize-background-md.png';
import prizeBackgroundSM from './images/prize-background-sm.png';
import prizeBackgroundXL from './images/prize-background-xl.png';
import savrPrize from './images/savr-prize.png';
import SliderMock from './images/slider-mock.png';
import ticketPrize from './images/ticket-prize.png';

interface MomentoPrizeProps {
  prizeInfo: PrizeInfo;
}

export const MomentoPrize = ({ prizeInfo }: MomentoPrizeProps) => {
  const contracts = useContractsAddresses();
  const logger = useLogger({
    event: 'momento',
    category: 'presentations',
    action: 'show',
    label: 'prize',
    buttonLocation: 'up',
    actionGroup: 'interactions',
  });
  const isLogged = useRef(false);

  useEffect(() => {
    const log = async () => {
      let tokenName = getTokenNameByAddress(prizeInfo.tokenAddress, contracts);
      if (!tokenName) {
        const tokenMetadata = await alchemy.core.getTokenMetadata(prizeInfo.tokenAddress);
        tokenName = tokenMetadata.name || prizeInfo.tokenAddress;
      }

      let prizeCategory = 'Various Tokens';
      if (prizeInfo.isERC721) {
        prizeCategory =
          contracts.ISaverAvatars === prizeInfo.tokenAddress
            ? 'iSaver Avatars'
            : 'NFT New collections';
      }
      if (prizeInfo.tokenAddress === contracts.ISaverSAVRToken) {
        prizeCategory = 'SAVR Tokens';
      }
      if (prizeInfo.tokenAddress === contracts.ISaverSAVToken) {
        prizeCategory = 'SAV Tokens';
      }
      if (prizeInfo.tokenAddress === contracts.ISaverPowers) {
        prizeCategory = 'iSaver Powers';
      }
      if (prizeInfo.tokenAddress === contracts.Ticket) {
        prizeCategory = 'Raffle Tickets';
      }

      logger({
        value: prizeInfo.isERC20
          ? bigNumberToString(prizeInfo.amount, { precision: 'full' })
          : prizeInfo.amount.toString(),
        content: tokenName,
        context: prizeCategory as any,
      });
      isLogged.current = true;
    };

    if (prizeInfo && !isLogged.current) log();
  }, [prizeInfo, contracts, logger]);

  const renderPrize = useCallback(() => {
    if (prizeInfo.isERC721) {
      return (
        <NFT
          tokenId={prizeInfo.tokenId}
          tokenAddress={prizeInfo.tokenAddress}
          isISaverCollection={contracts.ISaverAvatars === prizeInfo.tokenAddress}
        />
      );
    }

    switch (prizeInfo.tokenAddress) {
      case contracts.ISaverSAVRToken:
        return <SavrTokens amount={prizeInfo.amount} />;
      case contracts.ISaverPowers:
        return <Powers tokenId={prizeInfo.tokenId} />;
      case contracts.Ticket:
        return <Ticket amount={prizeInfo.amount} />;
      default:
        return (
          <OtherTokens
            amount={prizeInfo.amount}
            tokenAddress={prizeInfo.tokenAddress}
            isERC1155={prizeInfo.isERC1155}
            isERC20={prizeInfo.isERC20}
          />
        );
    }
  }, [
    contracts.ISaverAvatars,
    contracts.ISaverPowers,
    contracts.ISaverSAVRToken,
    contracts.Ticket,
    prizeInfo.amount,
    prizeInfo.isERC1155,
    prizeInfo.isERC20,
    prizeInfo.isERC721,
    prizeInfo.tokenAddress,
    prizeInfo.tokenId,
  ]);

  return (
    <Flex
      h="100%"
      bgImage={{
        sm: `url(${prizeBackgroundSM})`,
        md: `url(${prizeBackgroundMD})`,
        lg: `url(${prizeBackgroundLG})`,
        xl: `url(${prizeBackgroundXL})`,
        '2xl': `url(${prizeBackground2XL})`,
      }}
      bgPosition="center center"
      bgSize="cover"
      bgRepeat="no-repeat"
      justifyContent="center"
      alignItems="flex-start"
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      animation={{ duration: 0.5 }}
    >
      {renderPrize()}
    </Flex>
  );
};

const SavrTokens = ({ amount }: Pick<PrizeInfo, 'amount'>) => {
  const amountString = useMemo(
    () => parseFloat(bigNumberToString(amount, { precision: 'full' })),
    [amount]
  );

  return (
    <PrizeCard label="SAVR Tokens">
      <Image src={savrPrize} alt="SAVR" pos="absolute" left="0" top="0" />
      <Text
        fontWeight="black"
        fontSize={{ base: '20px', lg: '48px', xl: '84px' }}
        lineHeight="1"
        zIndex={10}
      >
        {amountString}
      </Text>
      <Text
        fontWeight="black"
        fontSize={{ base: '16px', lg: '32px', xl: '52px' }}
        lineHeight="1"
        zIndex={10}
      >
        SAVR
      </Text>
    </PrizeCard>
  );
};

const Powers = ({ tokenId }: Pick<PrizeInfo, 'tokenId'>) => {
  const powerPrizes: Record<number, any> = {
    0: powerAPrize,
    1: powerBPrize,
    2: powerCPrize,
    3: powerDPrize,
  };

  return (
    <PrizeCard label="iSaver Powers">
      <Image src={powerPrizes[Number(tokenId)]} alt="iSaver Powers" />
    </PrizeCard>
  );
};

const NFT = ({
  tokenId,
  tokenAddress,
  isISaverCollection,
}: Pick<PrizeInfo, 'tokenId' | 'tokenAddress'> & { isISaverCollection: boolean }) => {
  const { nft } = useGetNFT(tokenAddress, Number(tokenId));

  const image = useMemo(() => {
    const link = nft?.image.pngUrl || nft?.image.cachedUrl || nft?.image.originalUrl;
    if (link?.includes('ipfs.io') && nft?.contract.openSeaMetadata.imageUrl) {
      return nft?.contract.openSeaMetadata.imageUrl;
    }
    return link;
  }, [nft]);

  return (
    <PrizeCard label={isISaverCollection ? 'iSaver Avatars' : 'NFT New collections'} padding="0px">
      <Image src={image} alt={nft?.name} />
    </PrizeCard>
  );
};

const Ticket = ({ amount }: Pick<PrizeInfo, 'amount'>) => {
  return (
    <PrizeCard label="Raffle Tickets">
      <Image src={ticketPrize} alt="ticket" />
      <Text
        fontWeight="black"
        fontSize={{ sm: '40px', lg: '44px', xl: '84px' }}
        lineHeight={{ sm: '28px', lg: '30px', xl: '1' }}
        zIndex={10}
        pos="absolute"
        right="10px"
        bottom="10px"
      >
        x{amount.toString()}
      </Text>
    </PrizeCard>
  );
};

const OtherTokens = ({
  amount,
  tokenAddress,
  isERC1155,
  isERC20,
}: Pick<PrizeInfo, 'amount' | 'tokenAddress' | 'isERC20' | 'isERC1155'>) => {
  const [symbol, setSymbol] = useState<string | null>(null);

  useEffect(() => {
    const fetchSymbol = async () => {
      const tokenMetadata = await alchemy.core.getTokenMetadata(tokenAddress);
      setSymbol(tokenMetadata.symbol);
    };

    fetchSymbol();
  }, [tokenAddress]);

  const amountString = useMemo(
    () =>
      isERC20
        ? bigNumberToString(amount, { precision: 'full' })
        : isERC1155
        ? amount.toString()
        : '',
    [isERC20, amount, isERC1155]
  );

  const amountFontSize = useMemo(
    () =>
      amountString.length > 3
        ? { sm: '20px', lg: '32px', xl: '64px' }
        : { sm: '20px', lg: '48px', xl: '84px' },
    [amountString]
  );

  return (
    <PrizeCard label="Various Tokens">
      <Image src={otherPrize} alt="SAVR" pos="absolute" left="0" top="0" />
      <Text fontWeight="black" fontSize={amountFontSize} lineHeight="1" zIndex={10}>
        {amountString}
      </Text>
      <Text
        fontWeight="black"
        fontSize={{ base: '16px', lg: '32px', xl: '52px' }}
        lineHeight="1"
        zIndex={10}
      >
        {symbol}
      </Text>
    </PrizeCard>
  );
};

const flipVariants = {
  front: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  back: {
    rotateY: 180,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const PrizeCard = ({
  padding = '10px',
  label,
  children,
}: PropsWithChildren & { padding?: string; label: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Flex
      mt={{ base: '45px', xl: '90px' }}
      flexDir="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        className="momento_prize_container"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        pos="relative"
        style={{ perspective: '1000px' }}
      >
        <Flex
          className="momento_prize"
          padding={padding}
          as={motion.div}
          initial="back"
          animate={isFlipped ? 'front' : 'back'}
          variants={flipVariants}
          style={{
            position: 'absolute',
            backfaceVisibility: 'hidden',
            rotate: '0deg',
            width: '100%',
            height: '100%',
          }}
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          pos="relative"
        >
          {children}
        </Flex>

        <motion.div
          initial="front"
          animate={isFlipped ? 'back' : 'front'}
          variants={flipVariants}
          style={{
            position: 'absolute',
            backfaceVisibility: 'hidden',
            rotateY: '180deg',
            width: '100%',
            height: '100%',
          }}
        >
          <Image src={SliderMock} alt="Slider Mock" />
        </motion.div>
      </Box>
      <Text textStyle="text1" textAlign="center" mt={{ base: '12px', xl: '30px' }}>
        {label}
      </Text>
    </Flex>
  );
};
