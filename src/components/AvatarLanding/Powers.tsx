import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { Box, Button, Flex, Input, Text, useBreakpoint, useNumberInput } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ContractsEnum, useContractAbi } from '@/hooks/contracts/useContractAbi';
import { useOnVisibleLogger } from '@/hooks/logger/useOnVisibleLogger';
import { useBuyPowers, usePowerPrices } from '@/hooks/useAvatarsSell';
import { useLogger } from '@/hooks/useLogger';
import { useAddressHasNFT } from '@/hooks/useNFTHolders';

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
    id: 0,
    name: 'Power A',
    description:
      // eslint-disable-next-line prettier/prettier
      'Unlocks access to an additional 5 Levels of the iSaver Referral Program for 365 days after activation. Each additional level will earn you 1% in SAVR from your friends` earnings',
    image: PowerAImage,
    color: 'white',
    price: 0,
  },
  {
    id: 1,
    name: 'Power B',
    description:
      'Unlocks access to the SAVR Staking Pool for 365 days after activation. Use this pool to maximize your income on the iSaver platform',
    image: PowerBImage,
    color: 'sav',
    price: 0,
  },
  {
    id: 2,
    name: 'Power C',
    description:
      'Increases the APR/APY of all Staking Pools on the iSaver platform for 365 days after activation',
    image: PowerCImage,
    color: 'green.100',
    price: 0,
  },
  {
    id: 3,
    name: 'Power D',
    description:
      'Increases the number of iSaver Raffle Tickets minted for completing PUZZLES - mini free-to-play game on the iSaver platform',
    image: PowerDImage,
    color: 'blue',
    price: 0,
  },
];

const settingsMobile = {
  dots: true,
  infinite: false,
  speed: 400,
  arrows: false,
  className: 'slider variable-width',
  slidesToShow: 1,
  variableWidth: true,
  initialSlide: 0,
  centerMode: true,
};

const settingsXl: Settings = {
  ...settingsMobile,
  initialSlide: 1,
};

export const Powers = () => {
  const [powers, setPowers] = useState(POWERS);
  const powerPrices = usePowerPrices(powers.map((power) => power.id));
  const bp = useBreakpoint({ ssr: false });
  const is2XL = ['2xl'].includes(bp);
  const isXL = ['xl'].includes(bp);
  const { address } = useAccount();
  const { address: avatarsAddress } = useContractAbi({ contract: ContractsEnum.ISaverAvatars });
  const buyPowers = useBuyPowers();

  const { hasNFT } = useAddressHasNFT(avatarsAddress, address);

  const sliderSettings = useMemo(() => {
    if (isXL) {
      return settingsXl;
    }
    return settingsMobile;
  }, [isXL]);

  useEffect(() => {
    setPowers((currentPowers) =>
      currentPowers.map((power) => ({
        ...power,
        price: powerPrices[power.id] || power.price,
      }))
    );
  }, [powerPrices]);

  const handleBuy = useCallback(
    (id: number, amount: number) => buyPowers.mutateAsync({ id, amount }),
    [buyPowers]
  );

  return (
    <>
      <Box
        className="powers"
        mt={
          hasNFT
            ? { sm: '60px', lg: '70px', xl: '200px', '2xl': '280px' }
            : { sm: '120px', lg: '130px', xl: '260px', '2xl': '340px' }
        }
        px={{ base: '10px', xl: '30px' }}
      >
        <Box className="powers__description" mb={{ sm: '30px', md: 'unset' }}>
          <Text
            id="powers"
            mb={{ sm: '15px', md: '20px', lg: '30px' }}
            mt={{ sm: '0', xl: '30px' }}
            textStyle="h2"
            as="h2"
            textTransform="uppercase"
          >
            Powers
          </Text>
          <Text textStyle={{ sm: 'text2', xl: 'text1' }}>
            Avatars unlock access to 4 Powers: A, B, C&nbsp;and D. Each Power represents a
            specialized NFT. The Powers will give you a greater impact from your investment and
            activity on the iSaver platform. You can choose to activate one or all of the Powers,
            depending on your goals. Once activated, each Power lasts for 365 days.
          </Text>
        </Box>
        <img className="powers__image" src={PowersImage} alt="Avatars unlock access to 4 Powers" />
        {is2XL ? (
          <Flex justifyContent="space-between" gap="20px" mt="200px">
            {powers.map((power) => (
              <PowersCard
                key={power.name}
                {...power}
                onBuy={(amount) => handleBuy(power.id, amount)}
              />
            ))}
          </Flex>
        ) : null}
      </Box>
      {!is2XL ? (
        <Box className="powers__slider">
          <Box className="powers__slider__background" bgColor="bgGreen.50" />
          <Slider {...sliderSettings}>
            {powers.map((power) => (
              <PowersCard
                key={power.name}
                {...power}
                onBuy={(amount) => handleBuy(power.id, amount)}
              />
            ))}
          </Slider>
        </Box>
      ) : null}
    </>
  );
};

const PowersCard = ({
  image,
  name,
  description,
  price,
  color,
  onBuy,
}: Omit<PowersCardProps, 'id'> & { onBuy: (amount: number) => Promise<void> }) => {
  const [localValue, setLocalValue] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
  const logger = useLogger({
    event: 'avatars',
    category: 'elements',
    buttonLocation: 'card',
  });

  const ref = useRef(null);
  useOnVisibleLogger(ref, {
    event: 'avatars',
    category: 'cards',
    action: 'show',
    buttonLocation: 'card',
    actionGroup: 'interactions',
    label: 'powers',
    content: name,
  });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const inputProps = getInputProps();

  const handleBuyPower = useCallback(() => {
    logger({
      action: 'button_click',
      label: 'mint',
      value,
      content: name,
      actionGroup: 'conversions',
    });

    setIsLoading(true);
    onBuy(parseInt(value))
      .then(() => setLocalValue(1))
      .finally(() => setIsLoading(false));
  }, [value, logger, name, onBuy]);

  const handlePlusClick = useCallback(
    (event: any) => {
      logger({
        action: 'element_click',
        label: 'plus',
        actionGroup: 'interactions',
        content: name,
      });
      inc.onClick?.(event);
      setLocalValue((val) => val + 1);
    },
    [inc, logger, name]
  );
  const handleMinusClick = useCallback(
    (event: any) => {
      logger({
        action: 'element_click',
        label: 'minus',
        actionGroup: 'interactions',
        content: name,
      });
      dec.onClick?.(event);
      setLocalValue((val) => val - 1);
    },
    [dec, logger, name]
  );

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
          <Button
            {...dec}
            onClick={handleMinusClick}
            variant="link"
            className="powers-card__counter__button"
          >
            <img src={MinusIcon} alt="minus" />
          </Button>
          <Input
            {...inputProps}
            value={localValue}
            textStyle="buttonSmall"
            className="powers-card__counter__input"
          />
          <Button
            {...inc}
            onClick={handlePlusClick}
            variant="link"
            className="powers-card__counter__button"
          >
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
        ref={ref}
        isDisabled={!isConnected}
        onClick={handleBuyPower}
        isLoading={isLoading}
        w="100%"
        mt="15px"
        h="35px"
      >
        <Text textStyle="buttonSmall">MINT</Text>
      </Button>
    </Box>
  );
};
