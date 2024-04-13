import { useCallback, useEffect } from 'react';
import { useLocation, useOutlet, useSearchParams } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Box, Flex, Text } from '@chakra-ui/react';

import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { REFERRER_SEARCH_PARAMS_KEY, useLocalReferrer } from '@/hooks/useLocalReferrer';
import { isLanding, LANDING_PATH, routes } from '@/router';

export const Layout = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const { nodeRef } =
    routes.find((route) =>
      // Hack for '/raffles/:id' route
      route.path.includes(location.pathname.split('/')[1])
    ) ?? {};

  const scrollToTop = useCallback(() => {
    window?.scroll(0, 0);
  }, []);

  const { localReferrer, setLocalReferrer } = useLocalReferrer();
  const [searchParams] = useSearchParams();
  const queryRef = searchParams.get(REFERRER_SEARCH_PARAMS_KEY);
  useEffect(() => {
    if (queryRef && localReferrer !== queryRef) {
      setLocalReferrer(queryRef);
    }
  }, [queryRef, localReferrer, setLocalReferrer]);

  const isLandingPath = Boolean(isLanding && location.pathname === LANDING_PATH);

  const isAdminPage = location.pathname === '/admin-panel';

  return (
    <>
      {/* // TODO: remove after migration */}
      {isAdminPage ? null : (
        <Flex
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          justifyContent="center"
          alignItems="center"
          zIndex={1000000000000}
          bgColor="rgba(0,0,0,0.5)"
        >
          <Box
            borderRadius="5px"
            bgColor="gray.200"
            textAlign="center"
            padding="24px"
            maxWidth="500px"
          >
            <Text textStyle="h3" mb="12px">
              Attention please!
            </Text>
            <Text textStyle="text1">
              We are currently updating our contracts and therefore the platform is closed for
              maintenance. SAV and SAVR tokens are paused. We'll be back in a few hours.
            </Text>
          </Box>
        </Flex>
      )}
      <Header isLandingView={isLandingPath} />
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef as any}
          timeout={250}
          classNames="fade-transition"
          onEntering={scrollToTop}
          unmountOnExit
          in
          appear
        >
          {(state) => (
            <Flex ref={nodeRef as any} flexGrow={1} direction="column">
              {currentOutlet}
              <Footer />
            </Flex>
          )}
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};
