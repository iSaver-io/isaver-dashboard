import { useEffect, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { Box } from '@chakra-ui/react';

import SliderMock from './images/slider-mock.png';

import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';

interface MainSliderProps {
  isLoading: boolean;
}

export const MainSlider = ({ isLoading }: MainSliderProps) => {
  const [images] = useState<string[]>([
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
  ]);
  const [settings, setSettings] = useState<Settings>({
    className: 'center',
    centerMode: true,
    infinite: true,
    speed: 120,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 639,
        settings: {
          centerPadding: '96px',
          slidesToShow: 1,
        },
      },
    ],
  });

  useEffect(() => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      autoplaySpeed: isLoading ? 100 : 10000,
    }));
  }, [isLoading]);

  return (
    <Box
      className="momento_mainSlider"
      mt={{ base: '30px', lg: '75px' }}
      py={{ base: '45px', lg: '90px' }}
    >
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box key={index} px={{ sm: '5px', xl: '15px' }} textAlign="center">
            <img src={image} alt="slider item" width="100%" />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
