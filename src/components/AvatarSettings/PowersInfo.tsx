import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';

import {
  useActivatePowerAccess,
  useActiveAvatar,
  usePowerActivationFee,
} from '@/hooks/useAvatarSettings';

import superpowersImage from './images/superpowers.png';
import { PowerCard } from './PowerCard';

const POWERS = [
  {
    id: 0,
    name: 'A',
    label: 'Build a Team',
    description: '+5 Levels in the Referral Program and 1% in SAVR from each level',
  },
  {
    id: 1,
    name: 'B',
    label: 'Earn',
    description: 'Access to the SAVR Staking Pool without lockup',
  },
  {
    id: 2,
    name: 'C',
    label: 'Earn',
    description: '+2% APR/APY of all Staking Pools on the platform',
  },
  {
    id: 3,
    name: 'D',
    label: 'Win',
    description: 'x2 iSaver Raffle Tickets minted in PUZZLES',
  },
];

export const PowersInfo = () => {
  const { activeAvatar, hasAvatar } = useActiveAvatar();
  const powerActivationFee = usePowerActivationFee();
  const { mutateAsync, isLoading } = useActivatePowerAccess();

  const isPowersAllowed = hasAvatar && activeAvatar?.isPowersAllowed;

  return (
    <Box className="powersInfo">
      <Box textAlign="center">
        <Text textStyle="h2" as="h2" textTransform="uppercase">
          Powers info
        </Text>
        {isPowersAllowed || !hasAvatar ? (
          <Text textStyle="text2" mt="15px">
            All about Powers is{' '}
            <Link as={RouterLink} to="/" color="savr">
              here
            </Link>
          </Text>
        ) : (
          <>
            <Text textStyle="text2" mt="10px">
              Activating the Powers Block
            </Text>
            {powerActivationFee ? (
              <Text textStyle="h3" color="sav" mt="10px">
                {powerActivationFee.toString()} SAV
              </Text>
            ) : null}
            <div className="powersInfo_line" />
            <Button
              isLoading={isLoading}
              onClick={() => mutateAsync()}
              size="md"
              mt={{ base: '15px', '2xl': '25px' }}
            >
              activate
            </Button>
          </>
        )}
      </Box>
      <Flex className="powersInfo_powers">
        <Flex flexDirection="column" gap={{ base: '24px', xl: '40px' }}>
          <PowerCard {...POWERS[0]} isPowersAllowed={isPowersAllowed} />
          <PowerCard {...POWERS[1]} isPowersAllowed={isPowersAllowed} />
        </Flex>
        <img
          className={`powersInfo_image ${!isPowersAllowed ? 'not-allowed' : ''}`}
          src={superpowersImage}
          alt="Super powers"
        />
        <Flex flexDirection="column" gap={{ base: '24px', xl: '40px' }}>
          <PowerCard {...POWERS[2]} isPowersAllowed={isPowersAllowed} />
          <PowerCard {...POWERS[3]} isPowersAllowed={isPowersAllowed} />
        </Flex>
      </Flex>
    </Box>
  );
};
