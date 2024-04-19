import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { Box, Image, Text } from '@chakra-ui/react';
import { useNetwork } from 'wagmi';

import { useOnVisibleLogger } from '@/hooks/logger/useOnVisibleLogger';
import { useMomentoNFTPrizes } from '@/hooks/useMomento';
import { getOpenseaLink } from '@/utils/getExplorerLink';

import Prizes1 from './images/prizes1.png';
import Prizes2 from './images/prizes2.png';

const sliderSettings: Settings = {
  infinite: true,
  speed: 400,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  dots: true,
  arrows: true,
  variableWidth: false,
  adaptiveHeight: false,
  swipeToSlide: true,

  responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 3,
        arrows: false,
      },
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 2,
        arrows: false,
      },
    },
  ],
};

const cardsMock = [
  {
    image: Prizes1,
    label: 'Fangster 3580',
    contract: '0xeff82d6979a9961a081513d5d0a3d70e833a0de1',
    tokenId: '0',
  },
  {
    image: Prizes2,
    label: '#4524',
    contract: '0xeff82d6979a9961a081513d5d0a3d70e833a0de1',
    tokenId: '1',
  },
  {
    image: Prizes1,
    label: 'Fangster 3580',
    contract: '0xeff82d6979a9961a081513d5d0a3d70e833a0de1',
    tokenId: '2',
  },
  {
    image: Prizes2,
    label: '#4524',
    contract: '0xeff82d6979a9961a081513d5d0a3d70e833a0de1',
    tokenId: '3',
  },
  {
    image: Prizes2,
    label: '#4524',
    contract: '0xeff82d6979a9961a081513d5d0a3d70e833a0de1',
    tokenId: '4',
  },
];

export const Prizes = () => {
  const [settings, setSettings] = useState(sliderSettings);
  const { externalNFTs, isLoadingExternalNFT } = useMomentoNFTPrizes();

  const cards = useMemo(() => {
    if (isLoadingExternalNFT) return [];
    if (!externalNFTs.length) return [];

    return externalNFTs
      .map((nft) => ({
        image: nft?.image.pngUrl || nft?.image.cachedUrl || nft?.image.originalUrl,
        label: nft?.name,
        contract: nft?.contract.address,
        tokenId: nft?.tokenId,
      }))
      .filter((item) => !item.image?.includes('//ipfs'));
  }, [externalNFTs, isLoadingExternalNFT]);

  const isSet = useRef(false);
  useEffect(() => {
    if (cards.length && !isSet.current) {
      isSet.current = true;
      setSettings((current) => ({ ...current, initialSlide: 0 }));
    }
  }, [cards]);

  return (
    <Box textAlign="center">
      <Text textStyle="h2" fontSize={{ sm: '26px', lg: '38px' }} px={{ sm: '24px', md: '0' }}>
        YOU CAN WIN PRIZES
      </Text>
      <Text textStyle="h3" mt={{ sm: '20px', '2xl': '50px' }} fontSize={{ sm: '18px', lg: '26px' }}>
        NFT TOP COLLECTIONS
      </Text>
      <div className="momento_line" />
      <Box className="momento_prizes" mt={{ sm: '30px', '2xl': '50px' }}>
        <Slider {...settings}>
          {cards.map((card, index) => (
            <PrizeCard key={card.label + index.toString()} {...card} />
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

type PrizeCardProps = {
  image?: string;
  label?: string;
  contract?: string;
  tokenId?: string;
};
const PrizeCard = ({ image, label, tokenId, contract }: PrizeCardProps) => {
  const { chain } = useNetwork();
  const ref = useRef(null);

  useOnVisibleLogger(ref, {
    event: 'momento',
    category: 'banners',
    action: 'show',
    label: 'top_nft',
    content: label,
    buttonLocation: 'mid',
    actionGroup: 'interactions',
  });

  const handleOpenOpenseaPage = useCallback(() => {
    const link = getOpenseaLink(contract || '', tokenId || '', chain);
    window.open(link, '_blank');
  }, [chain, contract, tokenId]);

  return (
    <Box px={{ sm: '4px', xl: '10px' }} textAlign="center">
      <Box width={{ sm: '146px', xl: '310px' }} height={{ sm: '146px', xl: '310px' }}>
        <Image src={image} alt="slider item" objectFit="contain" />
      </Box>
      <Text
        ref={ref}
        mt={{ sm: '20px' }}
        fontSize={{ sm: '12px' }}
        _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={handleOpenOpenseaPage}
      >
        {label}
      </Text>
    </Box>
  );
};
