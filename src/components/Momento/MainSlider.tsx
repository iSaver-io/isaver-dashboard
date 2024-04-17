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
}

export const MainSlider = ({ isLoading, prizeInfo }: MainSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [speed, setSpeed] = useState(800);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [showPrize, setShowPrize] = useState<boolean>(false);
  const [hideCard, setHideCard] = useState<boolean>(false);
  const [images] = useState<string[]>([
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
    SliderMock,
  ]);
  const [settings] = useState<Settings>({
    easing: 'linear',
    focusOnSelect: false,
    pauseOnDotsHover: false,
    pauseOnFocus: false,
    pauseOnHover: false,
    draggable: true,
    infinite: true,
    touchMove: true,
    autoplay: true,
    cssEase: 'linear',
    swipeToSlide: true,

    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
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
    if (!prizeInfo) {
      setShowPrize(false);
      setHideCard(false);
      setIsAutoplay(false);
      setSpeed(800);
    }
  }, [prizeInfo]);

  useEffect(() => {
    if (isLoading) {
      setIsAutoplay(true);
    }
  }, [isLoading]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (hideCard) {
      timeout = setTimeout(() => setShowPrize(true), 600);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [hideCard]);

  const handleAfterChange = useCallback(
    (slide: number) => {
      if (prizeInfo) {
        if (speed > 700) {
          setIsAutoplay(false);
          setCurrentSlide(slide);
          setHideCard(true);
          setSpeed(800);
          return;
        }
        setSpeed((val) => val + 100);
      } else if (isLoading) {
        setIsAutoplay(true);
        if (speed > 150) {
          setSpeed((val) => Math.max(val - 100, 150));
        }
      } else {
        if (speed > 700) {
          setIsAutoplay(false);
          setCurrentSlide(slide);
          setSpeed(800);
        }
        setSpeed((val) => val + 100);
      }
    },
    [isLoading, prizeInfo, speed]
  );

  return (
    <AnimatePresence>
      <Box className="momento_mainSlider" mt={{ base: '30px', lg: '22px', xl: '32px' }} h="100%">
        {showPrize && prizeInfo ? (
          <MomentoPrize prizeInfo={prizeInfo} />
        ) : (
          <Box py={{ base: '45px', xl: '90px' }}>
            <Slider
              {...settings}
              afterChange={handleAfterChange}
              autoplaySpeed={isAutoplay ? 0 : 100000000}
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
                  _focus={{ outline: 'none' }}
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
