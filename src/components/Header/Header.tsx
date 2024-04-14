import { FC, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Circle,
  Container,
  Flex,
  IconButton,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import { useAccount, useDisconnect } from 'wagmi';

import { ReactComponent as BurgerIcon } from '@/assets/images/icons/burger.svg';
import { Logo } from '@/assets/images/icons-components/Logo';
import { WalletMenu } from '@/components/Header/WalletMenu';
import { ReactComponent as ArrowIcon } from '@/components/Landing/images/arrow-right.svg';
import { Menu } from '@/components/Menu/Menu';
import { TopNotification } from '@/components/TopNotification/TopNotification';
import { Button } from '@/components/ui/Button/Button';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useUserReferralInfo } from '@/hooks/referral/useReferralManager';
import { useStakingPlansUserInfo } from '@/hooks/staking/useStaking';
import { useTeams } from '@/hooks/teams/useTeams';
import { useLocalReferrer } from '@/hooks/useLocalReferrer';
import { useLogger } from '@/hooks/useLogger';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { APP_URL, LANDING_URL } from '@/router';
import { getPageByPathname } from '@/utils/logger';

import './Header.scss';

type HeaderProps = {
  isLandingView?: boolean;
};
export const Header: FC<HeaderProps> = ({ isLandingView }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { resetLocalReferrer } = useLocalReferrer();
  const { hasEndingSubscription } = useStakingPlansUserInfo();
  const { hasEndingReferralSubscription } = useUserReferralInfo();
  const { hasEndingTeamsSubscription } = useTeams();
  const location = useLocation();
  const navigate = useNavigateByHash();
  const bp = useBreakpoint({ ssr: false });
  const logger = useLogger({
    event: 'cross',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'header',
    actionGroup: 'interactions',
  });

  const hasNotification =
    isConnected &&
    (hasEndingSubscription || hasEndingReferralSubscription || hasEndingTeamsSubscription);

  const handleDisconnect = useCallback(() => {
    resetLocalReferrer();
    disconnect();
    navigate('/');
  }, [resetLocalReferrer, disconnect, navigate]);

  const navigateToApp = useCallback(() => {
    logger({ event: 'landing', label: 'dashboard', action: 'button_click' });
    window.open(APP_URL, '_self');
  }, [logger]);

  const handleLogoClick = useCallback(() => {
    logger({ label: 'logotip' });
    return isLandingView ? navigate('/#top') : window.open(LANDING_URL, '_self');
  }, [logger, isLandingView, navigate]);

  const handleOpenBurgerMenu = useCallback(() => {
    logger({ label: 'menu' });
    onOpen();
  }, [logger, onOpen]);

  const pageName = useMemo(() => getPageByPathname(location.pathname), [location]);

  return (
    <Box className="app-header">
      <TopNotification />

      <Container variant="header" padding={{ sm: '13px 10px', md: '13px 0' }}>
        <Box
          as="a"
          cursor="pointer"
          height={{ sm: '40px', '2xl': '82px' }}
          width={{ sm: '139px', '2xl': '279px' }}
          onClick={handleLogoClick}
        >
          <Logo />
        </Box>

        <Flex>
          {!isLandingView ? (
            isConnected ? (
              <WalletMenu address={address} connector={connector} disconnect={handleDisconnect} />
            ) : (
              <ConnectWalletButton
                location="header"
                event="cross"
                content={pageName}
                isSmall={['sm', 'md', 'lg'].includes(bp)}
                size={{ sm: 'md', '2xl': 'lg' }}
              />
            )
          ) : ['sm', 'md', 'lg'].includes(bp) ? (
            <IconButton
              size="md"
              variant="secondaryFilled"
              aria-label="Open app"
              border="none"
              icon={<ArrowIcon width="24px" />}
              onClick={navigateToApp}
              padding={{ sm: '0' }}
            />
          ) : (
            <Button
              variant="secondaryFilled"
              size={{ sm: 'md', '2xl': 'lg' }}
              width="220px"
              border="none"
              onClick={navigateToApp}
            >
              Dashboard
            </Button>
          )}

          {!isLandingView ? (
            <Box position="relative">
              <IconButton
                ml={{ sm: '10px', xl: '20px' }}
                size={{ sm: 'md', '2xl': 'lg' }}
                variant="secondaryFilled"
                aria-label="Burger menu"
                icon={<BurgerIcon width="24px" />}
                onClick={handleOpenBurgerMenu}
                padding={{ sm: '0' }}
              />
              {hasNotification ? (
                <Circle
                  as="span"
                  size="10px"
                  bg="red"
                  position="absolute"
                  right="-2px"
                  top="-2px"
                />
              ) : null}
            </Box>
          ) : null}
        </Flex>
      </Container>

      <Menu isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
