import { useState } from 'react';
import { Container } from '@chakra-ui/react';

import { useDocumentTitle } from '@/hooks/useMeta';
import { useNFT } from '@/hooks/useNFTHolders';

import { AllTraits } from './AllTraits';
import { AvatarComponent } from './AvatarComponent';
import { AvatarSelectionModal } from './AvatarSelectionModal';
import { HistoryTable } from './HistoryTable';
import { NavigationPanel } from './NavigationPanel';
import { PowersInfo } from './PowersInfo';

import './AvatarSettings.scss';

const AvatarSettings = () => {
  const { isNFTCorrect } = useNFT();
  const [isOpen, setOpen] = useState(false);
  useDocumentTitle('iSaver | Avatar settings');

  return (
    <>
      <Container className="avatarSettings" variant="dashboard">
        <div className={`overlay ${isNFTCorrect ? 'hidden' : ''}`} />
        <NavigationPanel />
        <AvatarComponent onOpen={() => setOpen(true)} />
        <AllTraits />
        <PowersInfo />
        <HistoryTable />
      </Container>
      <AvatarSelectionModal isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
};

export default AvatarSettings;
