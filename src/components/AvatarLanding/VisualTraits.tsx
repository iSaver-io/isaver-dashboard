import Slider from 'react-slick';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import AvatarImage from './images/avatar.png';
import AccessoryImage from './images/visual-traits/accessory.png';
import BackgroundImage from './images/visual-traits/background.png';
import BodyImage from './images/visual-traits/body.png';
import ClothesImage from './images/visual-traits/clothes.png';
import EmotionImage from './images/visual-traits/emotion.png';
import EyesImage from './images/visual-traits/eyes.png';
import HornsImage from './images/visual-traits/horns.png';
import LetterImage from './images/visual-traits/letter.png';
import SkinImage from './images/visual-traits/skin.png';

type TraitsItemType = {
  title: string;
  description: string;
  image: string;
};

const TRAITS_DATA: TraitsItemType[] = [
  {
    title: 'Eyes',
    description: 'Oh, feel something in its unearthly eyes. We are sure of their 12 colors.',
    image: EyesImage,
  },
  {
    title: 'Body',
    description:
      'We are aware of 12 distinct types of Avatar bodies. You may prefer one or wish to collect them all.',
    image: BodyImage,
  },
  {
    title: 'Skin',
    description:
      'Avatars came in 12 different colors. Yes, they are slightly different from Earthlings.',
    image: SkinImage,
  },
  {
    title: 'Horns',
    description: 'Some Avatars have horns. The number of shapes and colors is unknown.',
    image: HornsImage,
  },
  {
    title: 'Clothes',
    description:
      'Incredibly, Avatars wear the clothes of Earthlings. This makes them even more like us.',
    image: ClothesImage,
  },
  {
    title: 'Emotion',
    description:
      'Observations indicate that their emotions are similar to those of humans. Happiness, interest, surprise and many others.',
    image: EmotionImage,
  },
  {
    title: 'Background',
    description:
      'Your Avatar can have one of 72 different backgrounds. They selected these colors themselves.',
    image: BackgroundImage,
  },
  {
    title: 'Letter',
    description: 'No one has any idea yet why this letter is necessary.',
    image: LetterImage,
  },
  {
    title: 'Accessory',
    description: 'What you will not find on the heads of some Avatars. There are very rare items.',
    image: AccessoryImage,
  },
];

const settings = {
  className: 'visual-traits__slider',
  infinite: false,
  dots: true,
  slidesToShow: 1,
  arrows: false,
  speed: 200,
  rows: 1,
  slidesPerRow: 3,
  adaptiveHeight: true,
};

export const VisualTraits = () => {
  const bp = useBreakpoint({ ssr: false });
  const isDesktop = ['xl', '2xl'].includes(bp);

  return (
    <Flex flexDirection="column" alignItems="center" px={isDesktop ? '40px' : '10px'}>
      <Text textStyle="h2" as="h2">
        TRAITS & BENEFITS
      </Text>
      <Flex flexDirection="column" alignItems="center" gap="50px" mt="30px" w="100%">
        <Text textStyle="h3" as="h3">
          VISUAL TRAITS
        </Text>
        {isDesktop ? (
          <Flex gap="40px">
            <Flex className="visual-traits__column">
              {TRAITS_DATA.slice(0, 4).map((trait) => (
                <TraitsItem key={trait.title} {...trait} />
              ))}
            </Flex>

            <Flex className="visual-traits__column">
              <img className="visual-traits__avatar" src={AvatarImage} alt="Avatar" />
              <TraitsItem {...TRAITS_DATA[4]} />
            </Flex>

            <Flex className="visual-traits__column">
              {TRAITS_DATA.slice(5).map((trait) => (
                <TraitsItem key={trait.title} {...trait} />
              ))}
            </Flex>
          </Flex>
        ) : (
          <Box w="100%">
            <img className="visual-traits__avatar" src={AvatarImage} alt="Avatar" />
            <Slider {...settings}>
              {TRAITS_DATA.map((trait) => (
                <TraitsItem key={trait.title} {...trait} />
              ))}
            </Slider>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

const TraitsItem = ({ title, description, image }: TraitsItemType) => {
  return (
    <Flex className="visual-traits__item" alignItems="flex-start" gap="15px">
      <img src={image} alt={title} width="50px" height="50px" />
      <div>
        <Text as="h4" textStyle="textBold" textTransform="uppercase" mt="14px" mb="10px">
          {title}
        </Text>
        <Text className="visual-traits__description" textStyle="textSansSmall">
          {description}
        </Text>
      </div>
    </Flex>
  );
};
