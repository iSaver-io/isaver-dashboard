import { useCallback, useEffect, useState } from 'react';
import { useLocation, useOutlet, useSearchParams } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Flex } from '@chakra-ui/react';

import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { REFERRER_SEARCH_PARAMS_KEY, useLocalReferrer } from '@/hooks/useLocalReferrer';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { isLanding, LANDING_PATH, routes } from '@/router';

export const Layout = () => {
  const location = useLocation();
  const scroll = useScrollToHash();
  const [isPageLoading, setIsPageLoading] = useState(true);

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

  useEffect(() => {
    if (location.hash && isPageLoading) {
      scroll(location.hash.slice(1), 150, 300);
    }
    setIsPageLoading(false);
  }, [location.hash, scroll, isPageLoading]);

  return (
    <>
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
