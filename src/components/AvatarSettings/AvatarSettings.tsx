import { useState } from 'react';
import { Container } from '@chakra-ui/react';

import { useDocumentTitle } from '@/hooks/useMeta';
import { useActiveAvatarNFT } from '@/hooks/useNFTHolders';

import { AllTraits } from './AllTraits';
import { AvatarComponent } from './AvatarComponent';
import { AvatarSelectionModal } from './AvatarSelectionModal';
import { HistoryTable } from './HistoryTable';
import { NavigationPanel } from './NavigationPanel';
import { PowersInfo } from './PowersInfo';

import './AvatarSettings.scss';

export const AvatarSettings = () => {
  const { hasAvatar } = useActiveAvatarNFT();
  const [isOpen, setOpen] = useState(false);
  useDocumentTitle('iSaver | Avatar settings');

  return (
    <>
      <Container className="avatarSettings" variant="dashboard">
        {!hasAvatar ? <div className="overlay" /> : null}
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
