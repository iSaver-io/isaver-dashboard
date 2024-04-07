import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';

import {
  useActivatePowerAccess,
  useActiveAvatar,
  usePowerActivationFee,
  useUserPowers,
} from '@/hooks/useAvatarSettings';
import { useLogger } from '@/hooks/useLogger';
import { useActiveAvatarNFT } from '@/hooks/useNFTHolders';
import { AVATAR_LANDING_POWERS_INFO_URL, AVATARS_URL } from '@/router';

import { ReactComponent as PowerActiveA } from './images/a_active.svg';
import { ReactComponent as PowerInactiveA } from './images/a_inactive.svg';
import { ReactComponent as PowerActiveB } from './images/b_active.svg';
import { ReactComponent as PowerInactiveB } from './images/b_inactive.svg';
import { ReactComponent as PowerActiveC } from './images/c_active.svg';
import { ReactComponent as PowerInactiveC } from './images/c_inactive.svg';
import { ReactComponent as PowerActiveD } from './images/d_active.svg';
import { ReactComponent as PowerInactiveD } from './images/d_inactive.svg';
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
    description: 'x2 iSaver Raffle Tickets minted in&nbsp;PUZZLES',
  },
];

export const PowersInfo = () => {
  const { activeAvatar, hasAvatar } = useActiveAvatar();
  const { avatarNFT } = useActiveAvatarNFT();
  const powerActivationFee = usePowerActivationFee();
  const { mutateAsync, isLoading } = useActivatePowerAccess();
  const logger = useLogger({
    event: 'settings',
    category: 'elements',
    action: 'button_click',
    buttonLocation: 'mid',
    actionGroup: 'conversions',
    context: 'powers',
  });

  const isPowersAllowed = hasAvatar && activeAvatar?.isPowersAllowed;

  const { isActive: isActiveA } = useUserPowers(0);
  const { isActive: isActiveB } = useUserPowers(1);
  const { isActive: isActiveC } = useUserPowers(2);
  const { isActive: isActiveD } = useUserPowers(3);

  const handleActivatePowerAccess = useCallback(() => {
    logger({
      label: 'activate',
      value: powerActivationFee.toString(),
      content: 'Powers Block',
    });
    return mutateAsync();
  }, [logger, mutateAsync, powerActivationFee]);

  return (
    <Box className="powersInfo" id="powers">
      <Box textAlign="center">
        <Text textStyle="h2" as="h2" textTransform="uppercase">
          Powers info
        </Text>
        {isPowersAllowed || !hasAvatar || !avatarNFT ? (
          <Text textStyle="text2" mt="15px">
            All about Powers is{' '}
            <Link
              as={RouterLink}
              to={AVATAR_LANDING_POWERS_INFO_URL}
              color="savr"
              target="_blank"
              onClick={() =>
                logger({ action: 'link_click', label: 'here', actionGroup: 'interactions' })
              }
            >
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
              onClick={handleActivatePowerAccess}
              size="md"
              mt={{ base: '15px', '2xl': '25px' }}
            >
              activate
            </Button>
          </>
        )}
      </Box>
      <Flex className="powersInfo_powers" alignItems="center">
        <Flex flexDirection="column" gap={{ base: '24px', xl: '40px' }}>
          <PowerCard {...POWERS[0]} isPowersAllowed={isPowersAllowed} />
          <PowerCard {...POWERS[1]} isPowersAllowed={isPowersAllowed} />
        </Flex>
        <Box className="powersInfo_imageContainer">
          {isActiveA ? <PowerActiveA /> : <PowerInactiveA />}
          {isActiveB ? <PowerActiveB /> : <PowerInactiveB />}
          {isActiveC ? <PowerActiveC /> : <PowerInactiveC />}
          {isActiveD ? <PowerActiveD /> : <PowerInactiveD />}
        </Box>
        <Flex flexDirection="column" gap={{ base: '24px', xl: '40px' }}>
          <PowerCard {...POWERS[2]} isPowersAllowed={isPowersAllowed} />
          <PowerCard {...POWERS[3]} isPowersAllowed={isPowersAllowed} />
        </Flex>
      </Flex>
    </Box>
  );
};
