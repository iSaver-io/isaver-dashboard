import Slider, { Settings } from 'react-slick';
import { Box, Text } from '@chakra-ui/react';

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
      breakpoint: 639,
      settings: {
        slidesToShow: 2,
        arrows: false,
      },
    },
  ],
};

const images = [Prizes1, Prizes2, Prizes1, Prizes2, Prizes1, Prizes2];

export const Prizes = () => {
  return (
    <Box textAlign="center">
      <Text textStyle="h2">YOU CAN WIN PRIZES</Text>
      <Text textStyle="h3" mt="24px">
        NFT TOP COLLECTIONS
      </Text>
      <div className="momento_line" />
      <Box className="momento_prizes" mt={{ base: '24px', lg: '48px' }}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <Box key={index} px={{ sm: '5px', xl: '15px' }}>
              <img src={image} alt="slider item" />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};
