import { useRef } from 'react';
import Slider from 'react-slick';
import { Flex, Grid, Text, useBreakpoint } from '@chakra-ui/react';

import { useOnVisibleLogger } from '@/hooks/logger/useOnVisibleLogger';

import BirthdayIcon from './images/other-traits/birthday.svg';
import DiligenceIcon from './images/other-traits/diligence.svg';
import GenotypeIcon from './images/other-traits/genotype.svg';
import HobbyIcon from './images/other-traits/hobby.svg';
import IntelligenceIcon from './images/other-traits/intelligence.svg';
import NameIcon from './images/other-traits/name.svg';
import PsychotypeIcon from './images/other-traits/psychotype.svg';
import TelegramIcon from './images/other-traits/telegram.svg';
import VitalityIcon from './images/other-traits/vitality.svg';

type TraitsItemType = {
  title: string;
  description: string;
  icon: string;
};

const TRAITS_DATA: TraitsItemType[] = [
  {
    title: 'Name',
    description:
      'You can give the Avatar your own name or a fictitious one. This may bring you fame and some benefits in the future',
    icon: NameIcon,
  },
  {
    title: 'Birthday',
    description:
      'Every activated Avatar gets a present for their birthday. You will be able to mint it within one month after this date',
    icon: BirthdayIcon,
  },
  {
    title: 'Telegram',
    description:
      'You can set your real username that you use in Messenger so that other Avatars or Earthlings can contact you',
    icon: TelegramIcon,
  },
  {
    title: 'Intelligence',
    description:
      // eslint-disable-next-line prettier/prettier
      'The higher your Avatar`s intelligence, the better chances you have to succeed in challenges of the next episodes',
    icon: IntelligenceIcon,
  },
  {
    title: 'Diligence',
    description:
      // eslint-disable-next-line prettier/prettier
      'The higher your Avatar`s diligence, the better chances you have to succeed in challenges of the next episodes',
    icon: DiligenceIcon,
  },
  {
    title: 'Vitality',
    description:
      // eslint-disable-next-line prettier/prettier
      'The higher your Avatar`s vitality, the better chances you have to succeed in challenges of the next episodes',
    icon: VitalityIcon,
  },
  {
    title: 'Psychotype',
    description:
      'All Avatars have been tested with the MBTI to determine their psychotype. The Myers-Briggs classification identifies <a href="https://www.16personalities.com" target="_blank">16&nbsp;personality types</a>',
    icon: PsychotypeIcon,
  },
  {
    title: 'Genotype',
    description:
      'The genotype of an organism is its complete set of genetic material. Avatars have 256&nbsp;unique genotypes',
    icon: GenotypeIcon,
  },
  {
    title: 'Hobby',
    description: 'Everyone should have a hobby. Find friends with the same hobby as your Avatar',
    icon: HobbyIcon,
  },
];

const settings = {
  className: 'other-traits__slider',
  infinite: false,
  dots: true,
  slidesToShow: 1,
  arrows: false,
  speed: 200,
  rows: 1,
  slidesPerRow: 3,
};

export const MorePersonality = () => {
  const bp = useBreakpoint({ ssr: false });
  const isDesktop = ['xl', '2xl'].includes(bp);

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      mt={{ sm: '60px', md: '70px', '2xl': '100px' }}
      px={isDesktop ? '40px' : '10px'}
    >
      <Text textStyle="h3" as="h3" fontSize={{ sm: '18px', lg: '26px' }}>
        MORE PERSONALITY
      </Text>
      {isDesktop ? (
        <Grid
          mt={{ sm: '20px', md: '30px' }}
          gap="20px"
          justifyContent="center"
          templateColumns="repeat(3, 1fr)"
          templateRows="repeat(3, 1fr)"
        >
          {TRAITS_DATA.map((trait) => (
            <TraitsItem key={trait.title} {...trait} />
          ))}
        </Grid>
      ) : (
        <Slider {...settings}>
          {TRAITS_DATA.map((trait) => (
            <TraitsItem key={trait.title} {...trait} />
          ))}
        </Slider>
      )}
    </Flex>
  );
};

const TraitsItem = ({ title, description, icon }: TraitsItemType) => {
  const ref = useRef(null);
  useOnVisibleLogger(ref, {
    event: 'avatars',
    category: 'elements',
    action: 'show',
    buttonLocation: 'mid',
    actionGroup: 'interactions',
    label: 'personalities',
    content: title,
  });

  return (
    <div className="other-traits__item">
      <Flex alignItems="center" justifyContent="space-between">
        <Text
          ref={ref}
          as="h3"
          textStyle="h3"
          fontSize={{ sm: '18px', '2xl': '22px' }}
          textTransform="uppercase"
        >
          {title}
        </Text>
        <img src={icon} alt={title} />
      </Flex>
      <Text
        textStyle="text2"
        mt="15px"
        fontSize={{ sm: '14px', '2xl': '16px' }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};
