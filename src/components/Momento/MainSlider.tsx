import Slider, { Settings } from 'react-slick';
import { Box } from '@chakra-ui/react';

import SliderMock from './images/slider-mock.png';

import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';

const settings: Settings = {
  className: 'center',
  centerMode: true,
  infinite: true,
  speed: 400,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  adaptiveHeight: true,
  arrows: false,

  responsive: [
    {
      breakpoint: 639,
      settings: {
        centerPadding: '96px',
        slidesToShow: 1,
      },
    },
  ],
};

const images = [SliderMock, SliderMock, SliderMock, SliderMock, SliderMock, SliderMock];

export const MainSlider = () => {
  return (
    <Box
      className="momento_mainSlider"
      mt={{ base: '30px', lg: '75px' }}
      py={{ base: '45px', lg: '90px' }}
    >
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box key={index} px={{ sm: '5px', xl: '15px' }}>
            <img src={image} alt="slider item" />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
