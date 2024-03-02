import { useEffect, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { Box } from '@chakra-ui/react';

import { useMomento } from '@/hooks/useMomento';

import DemoPrize from './images/otherPrizes/1.png';
import SliderMock from './images/slider-mock.png';

import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';

export const MainSlider = () => {
  const [images, setImages] = useState<string[]>([
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
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
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
  const { getPrize } = useMomento();

  useEffect(() => {
    if (getPrize.isLoading) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        speed: 100,
        autoplaySpeed: 100,
      }));
    }
  }, [getPrize.isLoading]);

  useEffect(() => {
    if (getPrize.isSuccess) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        autoplay: false,
        infinite: false,
      }));
      setImages([DemoPrize]);
    }
  }, [getPrize.isSuccess]);

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
