import { useCallback, useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import { Box, Button, Flex, Input, Text, useBreakpoint, useNumberInput } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useBuyPowers, usePowerPrices } from '@/hooks/useAvatarsSell';

import MinusIcon from './images/minus.svg';
import PlusIcon from './images/plus.svg';
import PowersImage from './images/powers.png';
import PowerAImage from './images/powers/a.png';
import PowerBImage from './images/powers/b.png';
import PowerCImage from './images/powers/c.png';
import PowerDImage from './images/powers/d.png';

type PowersCardProps = {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
  price: number;
};

let POWERS: PowersCardProps[] = [
  {
    id: 1,
    name: 'Power a',
    description:
      // eslint-disable-next-line prettier/prettier
      'Unlocks access to an additional 5 Levels of the iSaver Referral Program for 365 days after activation. Each additional level will earn you 1% in SAVR from your friends` earnings.',
    image: PowerAImage,
    color: 'white',
    price: 0,
  },
  {
    id: 2,
    name: 'Power b',
    description:
      'Unlocks access to the SAVR Staking Pool for 365 days after activation. Use this pool to maximize your income on iSaver platform.',
    image: PowerBImage,
    color: 'sav',
    price: 0,
  },
  {
    id: 3,
    name: 'Power c',
    description:
      'Increases the APR/APY of all Staking Pools on the iSaver platform for 365 days after activation.',
    image: PowerCImage,
    color: 'green.100',
    price: 0,
  },
  {
    id: 4,
    name: 'Power d',
    description:
      'Increases the number of iSaver Raffle Tickets minted for completing PUZZLES - mini free-to-play game on the iSaver platform.',
    image: PowerDImage,
    color: 'blue',
    price: 0,
  },
];

const settings = {
  dots: true,
  infinite: false,
  speed: 200,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: false,
  responsive: [
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 1,
        className: 'slider variable-width',
        centerMode: true,
        variableWidth: true,
      },
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 1,
        centerMode: false,
      },
    },
  ],
};

export const Powers = () => {
  const [powers, setPowers] = useState(POWERS);
  const powerPrices = usePowerPrices(powers.map((power) => power.id));
  const bp = useBreakpoint({ ssr: false });
  const is2XL = ['2xl'].includes(bp);

  useEffect(() => {
    setPowers((currentPowers) =>
      currentPowers.map((power) => ({
        ...power,
        price: powerPrices[power.id] || power.price,
      }))
    );
  }, [powerPrices]);

  return (
    <>
      <Box
        className="powers"
        mt={{ base: '100px', xl: '200px', '2xl': '280px' }}
        px={{ base: '10px', xl: '30px' }}
      >
        <Box className="powers__description">
          <Text textStyle="h2" as="h2" textTransform="uppercase">
            Powers
          </Text>
          <Text textStyle="text1">
            Avatars unlock access to 4 Powers: A, B, C and D. Each Power represents a specialized
            NFT. The Powers will give you a greater impact from your investment and activity on the
            iSaver platform. You can choose to activate one or all of the Powers, depending on your
            goals. Once activated, each Power lasts for 365 days.
          </Text>
        </Box>
        <img className="powers__image" src={PowersImage} alt="Avatars unlock access to 4 Powers" />
        {is2XL ? (
          <Flex justifyContent="space-between" gap="20px" mt="200px">
            {powers.map((power) => (
              <PowersCard key={power.name} {...power} />
            ))}
          </Flex>
        ) : null}
      </Box>
      {!is2XL ? (
        <Box className="powers__slider">
          <Box className="powers__slider__background" bgColor="bgGreen.50" />
          <Slider {...settings}>
            {powers.map((power) => (
              <PowersCard key={power.name} {...power} />
            ))}
          </Slider>
        </Box>
      ) : null}
    </>
  );
};

const PowersCard = ({ id, image, name, description, price, color }: PowersCardProps) => {
  const buyPowers = useBuyPowers();
  const { isConnected } = useAccount();
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps, value } = useNumberInput(
    {
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 100,
      precision: 0,
    }
  );

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const inputProps = getInputProps();

  const handleBuyPower = useCallback(() => {
    buyPowers.mutateAsync({ id, amount: value });
  }, [buyPowers, id, value]);

  return (
    <Box className="powers-card" bg="bgGreen.50">
      <img src={image} alt={name} />
      <Flex alignItems="center" justifyContent="space-between">
        <Text textStyle="textBold" textTransform="uppercase" color={color}>
          {name}
        </Text>
        <Text textStyle="text2">
          Price: <Text as="span">{price} SAV</Text>
        </Text>
      </Flex>
      <Text textStyle="textSansExtraSmall" color="gray.400" mt="10px" h="64px">
        {description}
      </Text>
      <Flex alignItems="center" justifyContent="space-between" mt="20px">
        <Flex className="powers-card__counter" alignItems="center" justifyContent="space-between">
          <Button {...dec} variant="link" className="powers-card__counter__button">
            <img src={MinusIcon} alt="minus" />
          </Button>
          <Input {...inputProps} textStyle="buttonSmall" className="powers-card__counter__input" />
          <Button {...inc} variant="link" className="powers-card__counter__button">
            <img src={PlusIcon} alt="minus" />
          </Button>
        </Flex>
        <Text textStyle="text2">
          Total:{' '}
          <Text as="span" color="sav">
            {price * Number(value)} SAV
          </Text>
        </Text>
      </Flex>
      <Button
        isDisabled={!isConnected}
        onClick={handleBuyPower}
        isLoading={buyPowers.isLoading}
        w="100%"
        mt="15px"
        h="35px"
      >
        <Text textStyle="buttonSmall">MINT</Text>
      </Button>
    </Box>
  );
};
