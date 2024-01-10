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
  Image,
  Link,
  Text,
} from '@chakra-ui/react';

import { ReactComponent as ActivateAvatarIcon } from '@/assets/images/icons/activate-avatar.svg';
import { ReactComponent as CrossIcon } from '@/assets/images/icons/cross.svg';
import { ReactComponent as GameboyIcon } from '@/assets/images/icons/gameboy.svg';
import { ReactComponent as GraphIcon } from '@/assets/images/icons/graph.svg';
import { ReactComponent as HouseIcon } from '@/assets/images/icons/house.svg';
import { ReactComponent as RocketIcon } from '@/assets/images/icons/rocket.svg';
import { ReactComponent as StarsIcon } from '@/assets/images/icons/stars.svg';
import { ReactComponent as TabletIcon } from '@/assets/images/icons/tablet.svg';
import { ReactComponent as WalletIcon } from '@/assets/images/icons/wallet.svg';
import { useUserReferralInfo } from '@/hooks/referral/useReferralManager';
import { useStakingPlansUserInfo } from '@/hooks/staking/useStaking';
import { useTeams } from '@/hooks/teams/useTeams';
import { useLogger } from '@/hooks/useLogger';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { useNFT } from '@/hooks/useNFTHolders';
import { APP_URL, isDashboard, WHITEPAPER_URL } from '@/router';

export const Menu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { nft, isNFTCorrect } = useNFT();
  const { hasEndingSubscription } = useStakingPlansUserInfo();
  const { hasEndingReferralSubscription } = useUserReferralInfo();
  const { hasEndingTeamsSubscription } = useTeams();
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

      if (isDashboard) {
        navigate(to);
        onClose();
      } else {
        window.open(APP_URL + to, '_self');
      }
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
          <Link
            display="flex"
            w="100%"
            alignItems="center"
            gap="20px"
            onClick={() => handleNavigateWithLogger('/avatar-settings')}
            _hover={{ color: 'green.400' }}
          >
            {isNFTCorrect ? (
              <>
                <Image
                  borderRadius="6"
                  w="58"
                  h="58"
                  src={nft?.image?.thumbnailUrl || nft?.image?.originalUrl}
                />
                <Text as="span" position="relative" textStyle="menuDefault">
                  Avatar settings
                </Text>
              </>
            ) : (
              <>
                <ActivateAvatarIcon />
                <Text as="span" position="relative" textStyle="menuDefault">
                  Activate Avatar
                </Text>
              </>
            )}
          </Link>
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
          <Divider mb="30px" borderBottomWidth="2px" borderColor="white" />
          <NavMenuItem
            text="Dashboard"
            icon={<HouseIcon />}
            onClick={() => handleNavigateWithLogger('/#dashboard')}
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
            hasAlert={hasEndingReferralSubscription || hasEndingTeamsSubscription}
            textAlert={
              hasEndingReferralSubscription
                ? 'Check your levels'
                : hasEndingTeamsSubscription
                ? 'Check your teams'
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
