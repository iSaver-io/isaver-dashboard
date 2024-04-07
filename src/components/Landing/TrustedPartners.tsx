import { useMemo } from 'react';
import Slider, { Settings } from 'react-slick';
import { Box, Flex, Image, useBreakpoint } from '@chakra-ui/react';

import Partner1 from './images/partner-1.svg';
import Partner2 from './images/partner-2.svg';
import Partner3 from './images/partner-3.svg';
import Partner4 from './images/partner-4.svg';
import Partner5 from './images/partner-5.svg';
import Partner6 from './images/partner-6.svg';

import './Landing.scss';

const settings: Settings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 400,
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  adaptiveHeight: true,
  swipeToSlide: true,

  responsive: [
    {
      breakpoint: 1023,
      settings: {
        rows: 2,
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 479,
      settings: {
        rows: 3,
        slidesToShow: 2,
      },
    },
  ],
};

const imagesXl = [Partner1, Partner5, Partner2, Partner6, Partner3, Partner4];
const imagesMd = [Partner1, Partner2, Partner5, Partner6, Partner3, Partner4];
const imagesSm = [Partner1, Partner2, Partner3, Partner5, Partner6, Partner4];

export const TrustedPartners = () => {
  const bp = useBreakpoint({ ssr: false });
  const images = useMemo(() => {
    if (['md', 'lg'].includes(bp)) return imagesMd;
    if (['xl', '2xl'].includes(bp)) return imagesXl;
    return imagesSm;
  }, [bp]);

  return (
    <Box py={{ sm: '80px', xl: '100px' }}>
      <Flex
        flexDirection="column"
        alignItems="center"
        mb={{ sm: '10px', xl: '50px' }}
        px={{ sm: '18px', md: 0 }}
      >
        <h4 className="heading">trusted partners</h4>
      </Flex>
      <Box>
        <Slider className="trusted-slider" {...settings}>
          {images.map((image, index) => (
            <Flex
              className="trusted-slider__item"
              display="flex !important"
              key={index}
              h={{ sm: '40px', xl: '80px' }}
              justifyContent="center"
              alignItems="center"
              px="5px"
              _focus={{ outline: 'none' }}
              mt={{ sm: '20px', xl: '0' }}
            >
              <Image objectFit="contain" maxH="100%" src={image} alt="slider item" />
            </Flex>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};
