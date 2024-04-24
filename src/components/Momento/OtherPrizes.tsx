// eslint-disable-next-line
import { useCallback, useState } from 'react';
import { Box, Grid, Link, Text, useBreakpoint } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { useLogger } from '@/hooks/useLogger';
import {
  APP_URL,
  AVATARS_URL,
  AVATAR_LANDING_POWERS_INFO_URL,
  DASHBOARD_PLAY_EVERYDAY_URL,
  WHITEPAPER_URL,
} from '@/router';

import BacksideIcon from './images/backside.svg';
import PrizeImage1 from './images/otherPrizes/1.png';
import PrizeImage2 from './images/otherPrizes/2.png';
import PrizeImage3 from './images/otherPrizes/3.png';
import PrizeImage4 from './images/otherPrizes/4.png';
import PrizeImage5 from './images/otherPrizes/5.png';
import PrizeImage6 from './images/otherPrizes/6.png';

export const OtherPrizes = () => {
  const logger = useLogger({
    event: 'momento',
    category: 'elements',
    action: 'link_click',
    buttonLocation: 'card',
    actionGroup: 'interactions',
  });

  return (
    <Box textAlign="center">
      <Text textStyle="h3" fontSize={{ sm: '18px', lg: '26px' }}>
        OTHER PRIZES
      </Text>
      <Grid
        className="momento_otherPrizes"
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={{ sm: '8px', xl: '20px', '2xl': '24px' }}
        width={{ sm: '300px', md: '454px', xl: '970px', '2xl': '978px' }}
        mt={{ sm: '30px', '2xl': '50px' }}
        mx="auto"
      >
        <Card
          image={PrizeImage1}
          title="iSaver Avatar"
          description={
            <>
              We know that a total of 12024 Avatars have arrived on Earth: 10000 are distributed for
              generation on our platform and 2024 are in the Momento pool. Join Momento for a chance
              to win an Avatar! More about Avatars is{' '}
              <Link
                href={AVATARS_URL}
                target="_self"
                onClick={() => logger({ label: 'here', content: 'iSaver Avatar' })}
              >
                here
              </Link>
            </>
          }
        />
        <Card
          image={PrizeImage2}
          title="NFT NEW Collections"
          description={
            <>
              New NFT collections are being created every day. We choose some of them and add them
              to the Momento pool for everyone to have a chance to win. A list of collections is
              always available in our{' '}
              <Link
                href="https://isaver.gitbook.io/isaver/products/momento"
                target="_blank"
                onClick={() => logger({ label: 'whitepaper', content: 'NFT NEW Collections' })}
              >
                Whitepaper
              </Link>
            </>
          }
        />
        <Card
          image={PrizeImage3}
          title="iSaver Powers"
          description={
            <>
              The Powers will give you a greater impact from your investment and activity on the
              iSaver platform. You can choose to activate one or all of the Powers, depending on
              your goals. Join Momento for a chance to win Powers! More about Powers is{' '}
              <Link
                href={AVATAR_LANDING_POWERS_INFO_URL}
                target="_self"
                onClick={() => logger({ label: 'here', content: 'iSaver Powers' })}
              >
                here
              </Link>
            </>
          }
        />
        <Card
          image={PrizeImage4}
          title="Raffle Tickets"
          description={
            <>
              The Ticket allows you to participate in the iSaver Raffles and Momento. Join Momento
              for a chance to win from 1 to 10 Tickets. You can mint your first Ticket by
              participating in our mini{' '}
              <Link
                href={DASHBOARD_PLAY_EVERYDAY_URL}
                target="_self"
                onClick={() => logger({ label: 'free_to_play', content: 'Raffle Tickets' })}
              >
                FREE&nbsp;TO&nbsp;PLAY
              </Link>
            </>
          }
        />
        <Card
          image={PrizeImage5}
          title="SAVR Tokens"
          description={
            <>
              Join Momento for a chance to win from 0.1 to 1,000 SAVR. And stake your SAVR{' '}
              <Link
                href={`${APP_URL}/staking`}
                target="_self"
                onClick={() => logger({ label: 'here', content: 'SAVR Tokens' })}
              >
                here
              </Link>
            </>
          }
        />
        <Card
          image={PrizeImage6}
          title="Various Tokens"
          description={
            <>
              Join Momento for a chance to win various ERC20 tokens on the Polygon blockchain. A
              list of tokens is always available in our{' '}
              <Link
                href="https://isaver.gitbook.io/isaver/products/momento"
                target="_blank"
                onClick={() => logger({ label: 'whitepaper', content: 'Various Tokens' })}
              >
                Whitepaper
              </Link>
            </>
          }
        />
      </Grid>
    </Box>
  );
};

interface CardProps {
  image: string;
  title: string;
  description: JSX.Element | string;
}

const flipVariants = {
  front: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  back: {
    rotateY: 180,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};
const Card = ({ image, title, description }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const bp = useBreakpoint({ ssr: false });
  const logger = useLogger({
    event: 'momento',
    category: 'elements',
    action: 'element_click',
    content: title,
    buttonLocation: 'card',
    actionGroup: 'interactions',
  });

  const toggleCard = useCallback(() => {
    if (bp === 'sm') {
      logger({ label: isFlipped ? 'backside2' : 'backside' });
      setIsFlipped((val) => !val);
    }
  }, [bp, logger, isFlipped]);

  const isSm = ['sm', 'md', 'lg'].includes(bp);

  return (
    <Box
      onMouseEnter={bp !== 'sm' ? () => setIsFlipped(true) : undefined}
      onMouseLeave={bp !== 'sm' ? () => setIsFlipped(false) : undefined}
      onClick={toggleCard}
    >
      <Box className={`momento_otherPrizes_card ${isSm ? 'momento_otherPrizes_card__small' : ''}`}>
        <motion.div
          className="front-wrapper"
          initial="front"
          animate={isFlipped ? 'back' : 'front'}
          variants={flipVariants}
          style={{
            position: 'absolute',
            backfaceVisibility: 'hidden',
            rotateY: '180deg',
            width: '100%',
            height: '100%',
          }}
        >
          <Box className="front">
            <img src={image} alt={title} width="100%" />
            <Text
              className="momento_otherPrizes_card_title"
              fontSize={isSm ? '12px' : '18px'}
              fontWeight={isSm ? '400' : '700'}
              mt={isSm ? '10px' : '25px'}
            >
              {title}
            </Text>
            <img className="momento_otherPrizes_backside" src={BacksideIcon} alt="Backside" />
          </Box>
        </motion.div>

        <motion.div
          className="back"
          initial="back"
          animate={isFlipped ? 'front' : 'back'}
          variants={flipVariants}
          style={{
            position: 'absolute',
            backfaceVisibility: 'hidden',
            rotateY: '0deg',
            width: '100%',
            height: '100%',
          }}
        >
          <Text
            className="momento_otherPrizes_card_title"
            textStyle={{ base: 'textSemiBold', xl: 'h3' }}
            textTransform="uppercase"
          >
            {title}
          </Text>
          <Text
            className="momento_otherPrizes_card_description"
            textStyle="note"
            mt="10px"
            px={{ base: '8px', xl: '24px' }}
          >
            {description}
          </Text>
          <img className="momento_otherPrizes_backside" src={BacksideIcon} alt="Backside" />
        </motion.div>
      </Box>
    </Box>
  );
};
