import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Text, useBreakpoint } from '@chakra-ui/react';

import { APP_URL, AVATARS_LANDING_PATH, WHITEPAPER_URL } from '@/router';

import BacksideIcon from './images/backside.svg';
import PrizeImage1 from './images/otherPrizes/1.png';
import PrizeImage2 from './images/otherPrizes/2.png';
import PrizeImage3 from './images/otherPrizes/3.png';
import PrizeImage4 from './images/otherPrizes/4.png';
import PrizeImage5 from './images/otherPrizes/5.png';
import PrizeImage6 from './images/otherPrizes/6.png';

export const OtherPrizes = () => {
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
              to win an Avatar! More about Avatars is <Link to={AVATARS_LANDING_PATH}>here</Link>
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
              always available in our <Link to={WHITEPAPER_URL}>Whitepaper</Link>
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
              <Link to={AVATARS_LANDING_PATH}>here</Link>
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
              participating in our mini <Link to={APP_URL}>FREE&nbsp;TO&nbsp;PLAY</Link>
            </>
          }
        />
        <Card
          image={PrizeImage5}
          title="SAVR Tokens"
          description={
            <>
              Join Momento for a chance to win from 1 to 1,000 SAVR. And stake your SAVR{' '}
              <Link to="/staking">here</Link>
            </>
          }
        />
        <Card
          image={PrizeImage6}
          title="Various Tokens"
          description={
            <>
              Join Momento for a chance to win various ERC20 tokens on the Polygon blockchain. A
              list of tokens is always available in our <Link to={WHITEPAPER_URL}>Whitepaper</Link>
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

const Card = ({ image, title, description }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const bp = useBreakpoint({ ssr: false });

  const toggleCard = useCallback(() => {
    if (bp === 'sm') {
      setIsFlipped((val) => !val);
    }
  }, [bp]);

  const isSm = ['sm', 'md', 'lg'].includes(bp);

  return (
    <Box
      onMouseEnter={bp !== 'sm' ? () => setIsFlipped(true) : undefined}
      onMouseLeave={bp !== 'sm' ? () => setIsFlipped(false) : undefined}
      onClick={toggleCard}
    >
      <Box
        className={`momento_otherPrizes_card ${isFlipped ? 'flipped' : ''} ${
          isSm ? 'momento_otherPrizes_card__small' : ''
        }`}
      >
        <div className="front">
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
        </div>
        <div className="back">
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
        </div>
      </Box>
    </Box>
  );
};
