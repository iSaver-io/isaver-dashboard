import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

import { useDocumentTitle } from '@/hooks/useMeta';

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
  useDocumentTitle('iSaver | Avatars');

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
      <Box pt={{ sm: '50px', xl: '60px' }} pb={{ sm: '60px', '2xl': '80px' }}>
        <Main />
        <AvatarsSlider />
      </Box>
      <Box bgColor="bgGreen.50" pt={{ sm: '60px', '2xl': '80px' }} pb={{ sm: '50px', lg: '100px' }}>
        <VisualTraits />
        <MorePersonality />
      </Box>
      <Box pt={{ sm: '50px', xl: '100px' }} pb={{ sm: '0', xl: '80px', '2xl': '100px' }}>
        <MintAvatar />
        <Powers />
      </Box>
      <Box bgColor="bgGreen.50" py={{ sm: '100px' }}>
        <HowItWorks />
        <Banner />
      </Box>
    </Box>
  );
};

export default AvatarLanding;
