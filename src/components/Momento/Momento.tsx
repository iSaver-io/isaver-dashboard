import { useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';

import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';

import { HistoryTable } from './HistoryTable';
import { Main } from './Main';
import { OtherPrizes } from './OtherPrizes';
import { Prizes } from './Prizes';

import './Momento.scss';

export const Momento = () => {
  useDocumentTitle('iSaver | Momento');
  useMetaDescription(
    'Instant Win-Win Raffle of various NFTs and ERC20 tokens. Anyone with iSaver Raffle Tickets can join the fun and win exciting prizes!'
  );

  useEffect(() => {
    const backgroundElement = document.querySelector('.background');
    if (backgroundElement) {
      backgroundElement.classList.add('momento-background');
    }

    return () => {
      if (backgroundElement) {
        backgroundElement.classList.remove('momento-background');
      }
    };
  }, []);

  return (
    <>
      <Box pt={{ sm: '20px', md: '30px' }} pb={{ sm: '30px', xl: '40px', '2xl': '50px' }}>
        <Main />
      </Box>
      <Container className="momento" variant="dashboard">
        <Box py={{ sm: '30px', xl: '40px', '2xl': '50px' }}>
          <Prizes />
        </Box>
        <Box py={{ sm: '30px', xl: '40px', '2xl': '50px' }}>
          <OtherPrizes />
        </Box>
        <Box
          pt={{ sm: '30px', xl: '40px', '2xl': '50px' }}
          pb={{ sm: '30px', xl: '50px', '2xl': '100px' }}
        >
          <HistoryTable />
        </Box>
      </Container>
    </>
  );
};
