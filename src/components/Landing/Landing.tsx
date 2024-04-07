import { Box } from '@chakra-ui/react';

import { About } from '@/components/Landing/About';
import { Banner } from '@/components/Landing/Banner';
import { Benefits } from '@/components/Landing/Benefits';
import { Main } from '@/components/Landing/Main';
import { Numbers } from '@/components/Landing/Numbers';
import { Plans } from '@/components/Landing/Plans';
import { Raffle } from '@/components/Landing/Raffle';
import { TrustedPartners } from '@/components/Landing/TrustedPartners';

import './Landing.scss';

export const Landing = () => {
  return (
    <Box overflowX="hidden" mt={{ sm: '-67px', '2xl': '-109px' }}>
      <Box id="top" pos="relative">
        <Main />
      </Box>
      <About />
      <Box className="main-container">
        <Benefits />
        <Numbers />
        <Plans />
      </Box>
      <Box className="main-container" overflow="visible">
        <Raffle />
      </Box>
      <Banner />
      <TrustedPartners />
    </Box>
  );
};

export default Landing;
