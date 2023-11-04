import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

import { AvatarsSlider } from './AvatarsSlider';
import { Banner } from './Banner';
import { HowItWorks } from './HowItWorks';
import { Main } from './Main';
import { MintAvatar } from './MintAvatar';
import { MorePersonality } from './MorePersonality';
import { Powers } from './Powers';
import { VisualTraits } from './VisualTraits';

import './AvatarLanding.scss';

const AvatarLanding = () => {
  useEffect(() => {
    const backgroundElement = document.querySelector('.background');
    if (backgroundElement) {
      backgroundElement.classList.add('avatar-landing');
    }

    return () => {
      if (backgroundElement) {
        backgroundElement.classList.remove('avatar-landing');
      }
    };
  }, []);

  return (
    <Box overflowX="hidden">
      <Box pt={{ sm: '50px', xl: '60px' }} pb={{ sm: '50px', xl: '100px' }}>
        <Main />
        <AvatarsSlider />
      </Box>
      <Box bgColor="bgGreen.50" py={{ sm: '50px', xl: '90px' }}>
        <VisualTraits />
        <MorePersonality />
      </Box>
      <Box pt={{ sm: '20px', lg: '60px' }} pb={{ sm: '0', xl: '100px' }}>
        <MintAvatar />
        <Powers />
      </Box>
      <Box bgColor="bgGreen.50" py={{ sm: '20px', xl: '90px' }}>
        <HowItWorks />
        <Banner />
      </Box>
    </Box>
  );
};

export default AvatarLanding;
