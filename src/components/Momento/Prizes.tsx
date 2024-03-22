import { useCallback, useMemo } from 'react';
import Slider, { Settings } from 'react-slick';
import { Box, Text } from '@chakra-ui/react';
import { useNetwork } from 'wagmi';

import { useMomentoPrizes } from '@/hooks/useMomento';
import { getOpenseaLink } from '@/utils/getExplorerLink';

import Prizes1 from './images/prizes1.png';
import Prizes2 from './images/prizes2.png';

const settings: Settings = {
  infinite: true,
  speed: 400,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  adaptiveHeight: true,
  dots: true,

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
];

export const Prizes = () => {
  const { externalNFTs } = useMomentoPrizes();
  const { chain } = useNetwork();

  const cards = useMemo(() => {
    if (externalNFTs.length) {
      return externalNFTs.map((nft) => ({
        image: nft?.image.originalUrl,
        label: nft?.name,
        contract: nft?.contract.address,
        tokenId: nft?.tokenId,
      }));
    }
    return cardsMock;
  }, [externalNFTs]);

  const handleOpenOpenseaPage = useCallback(
    (card: any) => {
      const link = getOpenseaLink(card.contract, card.tokenId, chain);
      window.open(link, '__blank');
    },
    [chain]
  );

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
            <Box
              width={{ sm: '146px', xl: '310px' }}
              key={card.label + index.toString()}
              px={{ sm: '4px', xl: '10px' }}
              textAlign="center"
              onClick={() => handleOpenOpenseaPage(card)}
            >
              <img src={card.image} alt="slider item" />
              <Text mt={{ sm: '20px' }} fontSize={{ sm: '12px' }}>
                {card.label}
              </Text>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};
