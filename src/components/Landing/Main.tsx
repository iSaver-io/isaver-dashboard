import { useCallback } from 'react';
import Slider from 'react-slick';
import { Box, Container, Flex, Text } from '@chakra-ui/react';

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
  const logger = useLogger({
    event: 'landing',
    category: 'elements',
    action: 'button_click',
    buttonLocation: 'up',
    actionGroup: 'interactions',
  });

  const settings = {
    autoplay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots: any) => (
      <Box
        pos={'absolute !important' as any}
        bottom={{ sm: '30px', xl: '40px' }}
        left="0"
        mt="0 !important"
      >
        <ul> {dots} </ul>
      </Box>
    ),
  };

  const handleGenerateClick = useCallback(() => {
    logger({ label: 'generate' });
    window.open(AVATARS_URL, '_self');
  }, [logger]);

  const handleGetStartedClick = useCallback(() => {
    logger({ label: 'get_started' });
    window.open(APP_URL, '_self');
  }, [logger]);

  const handleGoClick = useCallback(() => {
    logger({ label: 'go' });
    window.open(MOMENTO_URL, '_self');
  }, [logger]);

  return (
    <Slider {...settings}>
      <Box
        bgImage={{
          sm: `url(${bannerAvatarsSM})`,
          md: `url(${bannerAvatarsMD})`,
          xl: `url(${bannerAvatarsXL})`,
        }}
        bgPosition="bottom center"
        bgSize={{ sm: 'contain', md: 'auto 75%', lg: 'auto 90%', xl: 'auto 80%' }}
        bgRepeat="no-repeat"
        h={{ sm: '504px', md: '574px', lg: '484px', xl: '504px', '2xl': '665px' }}
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
              w={{ sm: '189px', xl: '300px' }}
              className="main-avatars-text"
              mb={{ sm: '60px', md: '230px', lg: '100px', xl: '112px', '2xl': '154px' }}
              ml={{ sm: '90px', md: '0' }}
            >
              They came from deep space and settled on the Polygon blockchain
            </Text>
            <Text
              textStyle="text2"
              fontSize={{ sm: '14px', xl: '24px' }}
              w={{ sm: '187px', xl: '300px' }}
              className="main-avatars-text"
              mb={{ sm: '80px', md: '230px', lg: '100px', xl: '84px', '2xl': '142px' }}
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
      <Box h={{ sm: '504px', md: '574px', lg: '484px', xl: '504px', '2xl': '665px' }} w="100%">
        <Container
          variant="header"
          alignItems="flex-end"
          h="100%"
          pb="105px"
          flexDir={{ sm: 'column', lg: 'row' }}
        >
          <Flex w="100%" flexDirection="column" justifyContent="center" flexGrow={1}>
            <Box>
              <h1 className="main-heading">
                <span>Build a team.</span>
                <br /> <span className="color-green">Earn.</span>{' '}
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
          <Box w="100%">
            <CoinImage />{' '}
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
        bgImage={`url(${bgMomento})`}
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        h={{ sm: '504px', md: '574px', lg: '484px', xl: '504px', '2xl': '665px' }}
        w="100%"
        pos="relative"
      >
        <Box
          bgImage={{
            lg: `url(${bannerMomentoLG})`,
            xl: `url(${bannerMomentoXL})`,
            '2xl': `url(${bannerMomento2XL})`,
          }}
          bgPosition="center left"
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
        >
          <Box textAlign={{ sm: 'center', lg: 'right' }}>
            <Text
              textStyle="text2"
              fontSize={{ sm: '14px', xl: '24px' }}
              w={{ sm: '270px', xl: '370px' }}
              mt={{ sm: '25px', xl: '0' }}
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
