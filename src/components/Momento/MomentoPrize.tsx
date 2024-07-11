import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { NftTokenType } from 'alchemy-sdk';
import { motion } from 'framer-motion';

import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { useLogger } from '@/hooks/useLogger';
import { PrizeInfo, useGetNFT } from '@/hooks/useMomento';
import alchemy from '@/modules/alchemy';
import { getImageLinkForNFT } from '@/utils/images';
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

const NFT_TOP_COLLECTIONS = [
  'b37e4befacc50b02102d1e2117c4ea8a54beff',
  '0x63e2f0c058ce9a194ec68f04320b7eb8ca555bd3',
  '0xc70a7496716b3e25546901fe88215531abbd5a10',
  '0x2f5b31d2b4891f0ed183d56dd6ebd55249ca1d0c',
  '0x150afa2dfcaaada471472dfa6ad4b79e718a197c',
  '0x425bf054ef7bad65b7bdd8e6587b1c3500e4f4ca',
  '0xe9eee7294dc7c3bb64fd57a514e755022a333295',
  '0x6ad08588568e258b2bdf065e7769fce398f68a1c',
  '0x4ffa698ca3374ff154e58c8388a3aafe430dc2d3',
  '0x85cbf58c9d20459339a0b1f586a5fac643a29286',
  '0x91e51b92a2efea89bf1b6f66ad719737264724be',
  '0x2d58a44d6c0a355de25761fb33a1f6269a97e2c5',
  '0x551ec76c9fbb4f705f6b0114d1b79bb154747d38',
  '0x47fae0155f418f7355b1ca8e46589811c272a7a8',
  '0x187778e70489bbd9c81de1f87fd6a9d2088cf1eb',
  '0xf43bc3f4f1edb7d4c373c8510a2888d69d83ceb7',
  '0x4bca2c2ece9402b5d4dd031b49d48166c40b7957',
  '0xb9c042c3275bc49799688eea1a29b1405d02946b',
  '0xf81cb9bfea10d94801f3e445d3d818e72e8d1da4',
  '0xe1c7be9a91bb376acbb7c205f1f733a3468153b4',
  '0x78865315e4419e63073527bfdb660c550905da14',
  '0x808ed3e23aac685126524aa4416d8eaeb2e767b9',
  '0x750314b875e8cff5baa385db3e172686ca1fce40',
  '0x24aa93b7abe09b5e55c5b29758282d05799ecea5',
  '0x62dcbeab3124e3b1a9f1ac317c0613db8d6966b3',
  '0x0ab302a678c1cf97043c1d932968d09d3176e64c',
  '0x20e8165515fe69b03be6012cdaa76c833af0e241',
  '0xfeee476cfaf56c2f359a63500415d5a2c7f2f2b9',
  '0x28616ec69747094ad01b8c9d393ef8f3c0620e47',
  '0x89d2e41408eacbbcc5eebeffaaa27fd2a01ff88b',
];

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
        const isTop = NFT_TOP_COLLECTIONS.includes(prizeInfo.tokenAddress);
        prizeCategory =
          contracts.ISaverAvatars === prizeInfo.tokenAddress
            ? 'iSaver Avatars'
            : isTop
            ? 'NFT TOP collections'
            : 'NFT NEW collections';
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
    if (
      (prizeInfo.isERC721 || prizeInfo.isERC1155) &&
      ![contracts.ISaverPowers, contracts.Ticket].includes(prizeInfo.tokenAddress)
    ) {
      return (
        <NFT
          isERC1155={prizeInfo.isERC1155}
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
        fontSize={{ sm: '46px', lg: '48px', xl: '84px' }}
        lineHeight="1"
        zIndex={10}
      >
        {amountString}
      </Text>
      <Text
        fontWeight="black"
        fontSize={{ sm: '28px', lg: '32px', xl: '52px' }}
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
  isERC1155,
  tokenId,
  tokenAddress,
  isISaverCollection,
}: Pick<PrizeInfo, 'tokenId' | 'tokenAddress' | 'isERC1155'> & { isISaverCollection: boolean }) => {
  const { nft } = useGetNFT(
    tokenAddress,
    tokenId,
    isERC1155 ? NftTokenType.ERC1155 : NftTokenType.ERC721
  );

  const image = useMemo(() => {
    return getImageLinkForNFT(nft);
  }, [nft]);

  const label = useMemo(
    () =>
      isISaverCollection
        ? 'iSaver Avatars'
        : NFT_TOP_COLLECTIONS.includes(tokenAddress)
        ? 'NFT TOP collections'
        : 'NFT NEW collections',
    [isISaverCollection, tokenAddress]
  );

  return (
    <PrizeCard label={label} padding="0px">
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
  const [decimals, setDecimals] = useState<number>(18);

  useEffect(() => {
    const fetchSymbol = async () => {
      const tokenMetadata = await alchemy.core.getTokenMetadata(tokenAddress);
      setSymbol(tokenMetadata.symbol);
      setDecimals(tokenMetadata.decimals || 18);
    };

    fetchSymbol();
  }, [tokenAddress]);

  const amountString = useMemo(
    () =>
      isERC20
        ? bigNumberToString(amount, { decimals, precision: 'full' })
        : isERC1155
        ? amount.toString()
        : '',
    [isERC20, decimals, amount, isERC1155]
  );

  const amountFontSize = useMemo(
    () => (amountString.length > 3 ? { sm: '32px', xl: '64px' } : { sm: '48px', xl: '84px' }),
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
        fontSize={{ sm: '24px', lg: '32px', xl: '52px' }}
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
