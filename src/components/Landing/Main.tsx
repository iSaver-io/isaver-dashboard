import { useCallback, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { Box, Container, Flex, Text } from '@chakra-ui/react';

import { useOnVisibleLogger } from '@/hooks/logger/useOnVisibleLogger';
import { useLogger } from '@/hooks/useLogger';
import { APP_URL, AVATARS_URL, MOMENTO_URL } from '@/router';

import { Button } from '../ui/Button/Button';

import bannerAvatarsMD from './images/banner-avatars-md.png';
import bannerAvatarsSM from './images/banner-avatars-sm.png';
import bannerAvatarsXL from './images/banner-avatars-xl.png';
import bannerMomento2XL from './images/banner-momento-2xl.png';
import bannerMomentoLG from './images/banner-momento-lg.png';
import bannerMomentoSM from './images/banner-momento-sm.png';
import bannerMomentoXL from './images/banner-momento-xl.png';
import bgMomento from './images/bg-momento.png';
import { CoinImage } from './CoinImage';

import './Landing.scss';

export const Main = () => {
  const [slider, setSlider] = useState<Slider | null>(null);
  const refSlideMain = useRef<HTMLDivElement>(null);
  const refSlideAvatars = useRef<HTMLDivElement>(null);
  const refSlideMomento = useRef<HTMLDivElement>(null);

  const logger = useLogger({
    event: 'landing',
    category: 'banners',
    action: 'click',
    buttonLocation: 'up',
    actionGroup: 'conversions',
  });

  const pause = () => {
    slider?.slickPause();
  };

  const settings: Settings = {
    autoplay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 10000,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots: any) => (
      <Box
        pos={'absolute !important' as any}
        bottom={{ sm: '30px', xl: '40px' }}
        left="0"
        mt="0 !important"
      >
        <ul>
          {dots.map((dot: number) => (
            <li key={dot} onClick={() => pause()}>
              {dot}
            </li>
          ))}
        </ul>
      </Box>
    ),
  };

  useOnVisibleLogger(refSlideMain, {
    event: 'landing',
    buttonLocation: 'up',
    actionGroup: 'interactions',
    category: 'banners',
    action: 'show',
    label: 'get_started',
  });
  useOnVisibleLogger(refSlideAvatars, {
    event: 'landing',
    buttonLocation: 'up',
    actionGroup: 'interactions',
    category: 'banners',
    action: 'show',
    label: 'avatars',
  });
  useOnVisibleLogger(refSlideMomento, {
    event: 'landing',
    buttonLocation: 'up',
    actionGroup: 'interactions',
    category: 'banners',
    action: 'show',
    label: 'momento',
  });

  const handleGenerateClick = useCallback(() => {
    logger({ label: 'avatars' });
    window.open(AVATARS_URL, '_self');
  }, [logger]);

  const handleGetStartedClick = useCallback(() => {
    logger({ label: 'get_started' });
    window.open(APP_URL, '_self');
  }, [logger]);

  const handleGoClick = useCallback(() => {
    logger({ label: 'momento' });
    window.open(MOMENTO_URL, '_self');
  }, [logger]);

  return (
    <Slider ref={(slider) => setSlider(slider)} {...settings}>
      <Box
        ref={refSlideAvatars}
        bgImage={{
          sm: `url(${bannerAvatarsSM})`,
          md: `url(${bannerAvatarsMD})`,
          xl: `url(${bannerAvatarsXL})`,
        }}
        bgPosition="bottom center"
        bgSize={{ sm: 'auto 70%', md: 'auto 70%', lg: 'auto 80%', xl: 'auto 70%' }}
        bgRepeat="no-repeat"
        h={{ sm: '570px', md: '640px', lg: '550px', xl: '570px', '2xl': '773px' }}
        w="100%"
        bgColor="#1f1f1f"
      >
        <Container
          variant="header"
          alignItems="center"
          justifyContent="flex-end"
          flexDir="column"
          h="100%"
          pb={{ sm: '75px', lg: '115px', xl: '100px', '2xl': '105px' }}
        >
          <Flex
            justifyContent="space-between"
            alignItems={{ sm: 'flex-start', md: 'flex-end' }}
            flexDir={{ sm: 'column', md: 'row' }}
            w="100%"
          >
            <Text
              textStyle="text2"
              fontSize={{ sm: '14px', xl: '24px' }}
              fontWeight={{ sm: 500, xl: 400 }}
              w={{ sm: '199px', xl: '330px' }}
              className="main-avatars-text"
              mb={{ sm: '90px', md: '240px', lg: '100px', xl: '112px', '2xl': '154px' }}
              ml={{ sm: '100px', md: '0' }}
            >
              They came from
              <br />
              Deep Space and settled on&nbsp;the&nbsp;Polygon blockchain
            </Text>
            <Text
              textStyle="text2"
              fontSize={{ sm: '14px', xl: '24px' }}
              fontWeight={{ sm: 500, xl: 400 }}
              w={{ sm: '170px', xl: '300px' }}
              className="main-avatars-text"
              mb={{ sm: '80px', md: '240px', lg: '100px', xl: '84px', '2xl': '142px' }}
              ml={{ sm: '0px', md: '0' }}
            >
              Mission: To help Earthlings create a decentralized world
            </Text>
          </Flex>
          <Text className="main-heading" fontSize={{ sm: '38px', lg: '52px', '2xl': '90px' }}>
            AVATARS
          </Text>
          <Button
            mt={{ sm: '15px', lg: '30px', xl: '20px', '2xl': '25px' }}
            variant="primary"
            fontSize={{ sm: '12px', '2xl': 'unset' }}
            width={{ sm: '150px', xl: '220px' }}
            onClick={handleGenerateClick}
          >
            Generate
          </Button>
        </Container>
      </Box>
      <Box
        ref={refSlideMain}
        h={{ sm: '570px', md: '640px', lg: '550px', xl: '570px', '2xl': '773px' }}
        w="100%"
        bgColor="#174033"
      >
        <Container
          variant="header"
          alignItems="flex-end"
          h="100%"
          pb="105px"
          pt={{ sm: '87px', lg: 0 }}
          flexDir={{ sm: 'column', lg: 'row' }}
        >
          <Flex
            w="100%"
            flexDirection="column"
            justifyContent="center"
            flexGrow={1}
            ml={{ xl: '10px', '2xl': 'unset' }}
          >
            <Box>
              <h1 className="main-heading">
                <span>Build a team.</span>
                <br /> <span className="color-sav">Earn.</span>{' '}
                <span className="color-blue">Win.</span>
              </h1>
              <h2 className="main-subheading">DeFI platform on Polygon</h2>
            </Box>
            <Box>
              <h5 className="main-text color-green">Up to 30% in Fixed Deposits</h5>
              <Button
                mt={{ sm: '15px', lg: '20px', xl: '25px', '2xl': '40px' }}
                variant="primary"
                fontSize={{ sm: '12px', '2xl': 'unset' }}
                width={{ sm: '150px', xl: '220px' }}
                display={{ sm: 'none', lg: 'block' }}
                onClick={handleGetStartedClick}
              >
                Get started
              </Button>
            </Box>
          </Flex>
          <Box w={{ base: '100%', xl: '405px', '2xl': '530px' }}>
            <CoinImage />
            <Button
              mt="15px"
              mx="auto"
              variant="primary"
              fontSize={{ sm: '12px', '2xl': 'unset' }}
              width={{ sm: '150px', xl: '220px' }}
              display={{ sm: 'block', lg: 'none' }}
              onClick={handleGetStartedClick}
            >
              Get started
            </Button>
          </Box>
        </Container>
      </Box>
      <Box
        ref={refSlideMomento}
        bgImage={`url(${bgMomento})`}
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        h={{ sm: '570px', md: '640px', lg: '550px', xl: '570px', '2xl': '773px' }}
        w="100%"
        pos="relative"
      >
        <Box
          bgImage={{
            lg: `url(${bannerMomentoLG})`,
            xl: `url(${bannerMomentoXL})`,
            '2xl': `url(${bannerMomento2XL})`,
          }}
          bgPosition={{ sm: 'center', '2xl': 'top center' }}
          bgSize="contain"
          bgRepeat="no-repeat"
          className="banner-momento__img"
        />
        <Container
          variant="header"
          alignItems={{ sm: 'center', lg: 'flex-end' }}
          justifyContent={{ sm: 'space-between', lg: 'flex-end' }}
          flexDir="column"
          h="100%"
          pb={{ sm: '75px', lg: '115px', xl: '100px', '2xl': '105px' }}
          pt={{ sm: '87px', lg: 0 }}
        >
          <Box textAlign={{ sm: 'center', lg: 'right' }}>
            <Text
              textStyle="text2"
              fontSize={{ sm: '14px', xl: '24px' }}
              w={{ sm: '270px', xl: '370px' }}
              mt={{ md: '0', lg: '25px', xl: '0' }}
              ml={{ sm: '0', lg: 'auto' }}
            >
              Instant Win-Win Raffle of various NFTs and SAVR tokens
            </Text>
            <Text
              color="blue"
              textStyle="h1"
              fontSize={{ sm: '38px', lg: '52px', xl: '90px' }}
              mt={{ sm: '15px', xl: '25px' }}
            >
              momento
            </Text>
            <Text textStyle="text1" mt={{ sm: '15px', xl: '25px' }}>
              Get a chance to win exciting prizes!
            </Text>
          </Box>
          <Box
            bgImage={`url(${bannerMomentoSM})`}
            bgPosition="center"
            bgSize="contain"
            bgRepeat="no-repeat"
            className="banner-momento__img"
            display={{ sm: 'block', lg: 'none' }}
          />
          <Button
            mt={{ sm: '15px', lg: '30px', xl: '25px' }}
            variant="primary"
            fontSize={{ sm: '12px', '2xl': 'unset' }}
            width={{ sm: '150px', xl: '220px' }}
            onClick={handleGoClick}
          >
            Go
          </Button>
        </Container>
      </Box>
    </Slider>
  );
};
