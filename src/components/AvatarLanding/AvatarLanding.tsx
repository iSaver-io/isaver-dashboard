import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { useDocumentTitle } from '@/hooks/useMeta';
import { useScrollToHash } from '@/hooks/useScrollToHash';

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
  const scroll = useScrollToHash();
  const { hash } = useLocation();

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

  useEffect(() => {
    if (hash) {
      scroll(hash.slice(1), 150, 300);
    }
  }, [hash, scroll]);

  return (
    <Box overflowX="hidden">
      <Box pt={{ sm: '20px', md: '30px' }} pb={{ sm: '30px', xl: '40px', '2xl': '50px' }}>
        <Main />
        <AvatarsSlider />
      </Box>
      <Box
        bgColor="bgGreen.50"
        pt={{ sm: '60px', lg: '70px', '2xl': '100px' }}
        pb={{ sm: '60px', lg: '70px', '2xl': '100px' }}
      >
        <VisualTraits />
        <MorePersonality />
      </Box>
      <Box
        pt={{ sm: '50px', lg: '60px', xl: '70px', '2xl': '100px' }}
        pb={{ sm: '0', xl: '40px', '2xl': '60px' }}
      >
        <MintAvatar />
        <Powers />
      </Box>
      <Box bgColor="bgGreen.50" py={{ sm: '60px', lg: '70px', '2xl': '100px' }}>
        <HowItWorks />
        <Banner />
      </Box>
    </Box>
  );
};

export default AvatarLanding;
