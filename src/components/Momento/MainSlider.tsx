import { useCallback, useEffect, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { Box, Image } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { PrizeInfo } from '@/hooks/useMomento';

import SliderMock from './images/slider-mock.png';
import { MomentoPrize } from './MomentoPrize';

import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';

interface MainSliderProps {
  isLoading: boolean;
  prizeInfo?: PrizeInfo;
  isSuccess: boolean;
}

export const MainSlider = ({ isLoading, isSuccess, prizeInfo }: MainSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [speed, setSpeed] = useState(180);
  const [autoplaySpeed, setAutoplaySpeed] = useState(100000000);
  const [showPrize, setShowPrize] = useState<boolean>(false);
  const [hideCard, setHideCard] = useState<boolean>(false);
  const [images] = useState<string[]>([
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
  ]);
  const [settings] = useState<Settings>({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    pauseOnHover: false,
    adaptiveHeight: true,
    className: 'center',
    centerMode: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          centerPadding: '0',
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  useEffect(() => {
    if (!isLoading && !isSuccess && !prizeInfo) {
      setShowPrize(false);
      setHideCard(false);
    }
  }, [isLoading, isSuccess, prizeInfo]);

  useEffect(() => {
    if (isLoading) {
      setAutoplaySpeed(180);
    }
  }, [isLoading]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (hideCard) {
      timeout = setTimeout(() => setShowPrize(true), 300);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [hideCard]);

  const handleAfterChange = useCallback(
    (slide: number) => {
      if (isSuccess) {
        if (speed > 500) {
          setAutoplaySpeed(100000000);
          setCurrentSlide(slide);
          setHideCard(true);
          return;
        }
        setAutoplaySpeed(autoplaySpeed);
        setSpeed(speed + 100);
      }
    },
    [autoplaySpeed, isSuccess, speed]
  );

  return (
    <AnimatePresence>
      <Box className="momento_mainSlider" mt={{ base: '30px', lg: '60px', xl: '80px' }} h="100%">
        {showPrize && prizeInfo ? (
          <MomentoPrize prizeInfo={prizeInfo} />
        ) : (
          <Box py={{ base: '45px', xl: '90px' }}>
            <Slider
              {...settings}
              afterChange={handleAfterChange}
              autoplaySpeed={autoplaySpeed}
              speed={speed}
            >
              {images.map((image, index) => (
                <Box
                  px={{ sm: '5px', xl: '15px' }}
                  as={motion.div}
                  animate={
                    index !== currentSlide && hideCard
                      ? { y: 290, opacity: 0, transition: { duration: 0.3 } }
                      : {}
                  }
                  key={index}
                  h={{ base: '130px !important', xl: '290px !important' }}
                  w={{ base: '140px !important', xl: '320px !important' }}
                >
                  <Image
                    src={image}
                    alt="slider item"
                    h={{ base: '130px !important', xl: '290px !important' }}
                    w={{ base: '130px !important', xl: '290px !important' }}
                    objectFit="contain"
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        )}
      </Box>
    </AnimatePresence>
  );
};
