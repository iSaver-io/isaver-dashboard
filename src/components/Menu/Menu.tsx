import { useCallback } from 'react';
import {
  Box,
  Circle,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Link,
  Text,
} from '@chakra-ui/react';

import { ReactComponent as CrossIcon } from '@/assets/images/icons/cross.svg';
import { ReactComponent as GameboyIcon } from '@/assets/images/icons/gameboy.svg';
import { ReactComponent as GraphIcon } from '@/assets/images/icons/graph.svg';
import { ReactComponent as HouseIcon } from '@/assets/images/icons/house.svg';
import { ReactComponent as RocketIcon } from '@/assets/images/icons/rocket.svg';
import { ReactComponent as StarsIcon } from '@/assets/images/icons/stars.svg';
import { ReactComponent as TabletIcon } from '@/assets/images/icons/tablet.svg';
import { ReactComponent as WalletIcon } from '@/assets/images/icons/wallet.svg';
import { useUserReferralInfo } from '@/hooks/referral/useReferralManager';
import { useSquads } from '@/hooks/squads/useSquads';
import { useStakingPlansUserInfo } from '@/hooks/staking/useStaking';
import { useLogger } from '@/hooks/useLogger';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { APP_URL, isLanding, WHITEPAPER_URL } from '@/router';

export const Menu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { hasEndingSubscription } = useStakingPlansUserInfo();
  const { hasEndingReferralSubscription } = useUserReferralInfo();
  const { hasEndingSquadsSubscription } = useSquads();
  const navigate = useNavigateByHash();
  const logger = useLogger({
    event: 'cross',
    category: 'elements',
    action: 'menu_click',
    buttonLocation: 'header',
    actionGroup: 'interactions',
  });

  const handleClose = useCallback(() => {
    logger({ label: 'close' });
    onClose();
  }, [onClose, logger]);

  const handleNavigateWithLogger = useCallback(
    (to: string) => {
      const label = to.replace('/', '').replace('#', '');
      logger({ label });
      navigate(to);
      onClose();
    },
    [navigate, onClose, logger]
  );

  const handleNavigateToWhitepaper = useCallback(() => {
    logger({ label: 'whitepaper' });
    window.open(WHITEPAPER_URL, '_blank');
  }, [logger]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerOverlay background="rgba(13, 35, 16, 0.5)" />
      <DrawerContent
        boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
        background="linear-gradient(96.85deg, #1a7b58 -8.44%, #1b3339 100%)"
      >
        <DrawerHeader
          p="30px 30px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text textStyle="h2" textTransform="uppercase">
            Menu
          </Text>
          <IconButton
            variant="secondary"
            aria-label="Close burger menu"
            icon={<CrossIcon />}
            onClick={handleClose}
            padding="0"
            size="md"
            _hover={{ bgColor: 'green.100' }}
          />
        </DrawerHeader>

        <DrawerBody>
          <NavMenuItem
            text="Dashboard"
            icon={<HouseIcon />}
            onClick={() =>
              isLanding ? window.open(APP_URL) : handleNavigateWithLogger('/#dashboard')
            }
          />
          <NavMenuItem
            text="Staking"
            onClick={() => handleNavigateWithLogger('/staking')}
            icon={<GraphIcon />}
            hasAlert={hasEndingSubscription}
            textAlert={hasEndingSubscription ? 'Check your subscription!' : undefined}
          />
          <NavMenuItem
            text="Team"
            icon={<StarsIcon />}
            onClick={() => handleNavigateWithLogger('/team')}
            hasAlert={hasEndingReferralSubscription || hasEndingSquadsSubscription}
            textAlert={
              hasEndingReferralSubscription
                ? 'Check your levels!'
                : hasEndingSquadsSubscription
                ? 'Check your teams!'
                : undefined
            }
          />
          <NavMenuItem
            text="Play everyday"
            onClick={() => handleNavigateWithLogger('/#claim-ticket')}
            icon={<GameboyIcon />}
          />
          <NavMenuItem
            text="Raffles"
            icon={<RocketIcon />}
            onClick={() => handleNavigateWithLogger('/#raffles')}
          />
          <Divider mb="30px" borderBottomWidth="2px" borderColor="white" />
          <NavMenuItem
            text="Buy SAV"
            icon={<WalletIcon />}
            onClick={() => handleNavigateWithLogger('/exchange')}
          />

          <NavMenuItem
            onClick={handleNavigateToWhitepaper}
            text="Whitepaper"
            icon={<TabletIcon />}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const NavMenuItem = ({
  text,
  icon,
  hasAlert,
  textAlert,
  disabled,
  subtitle,
  onClick,
}: {
  text: string;
  textAlert?: string;
  subtitle?: string;
  icon: any;
  hasAlert?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <>
    <Link
      display="flex"
      w="100%"
      alignItems="center"
      mb="30px"
      onClick={onClick}
      _hover={{ color: 'green.400' }}
    >
      <Box
        w="8"
        h="8"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={disabled ? 'gray' : 'green.400'}
      >
        {icon}
      </Box>
      <Flex ml={5} color={disabled ? 'gray' : 'inherit'}>
        <Flex direction="column">
          <Flex alignItems="center">
            <Text as="span" position="relative" textStyle="menuDefault">
              {text}
              {hasAlert ? (
                <Circle
                  as="span"
                  size="10px"
                  bg="red"
                  position="absolute"
                  right="-10px"
                  top="-3px"
                />
              ) : null}
            </Text>
            {textAlert ? (
              <Text color="red" ml="25px" position="relative" textStyle="textBold">
                {textAlert}
              </Text>
            ) : null}
          </Flex>
          {subtitle ? <Text textStyle="text1">{subtitle}</Text> : null}
        </Flex>
      </Flex>
    </Link>
  </>
);
