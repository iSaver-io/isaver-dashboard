import { Container } from '@chakra-ui/react';

import { useAvatarMetadata } from '@/hooks/useAvatarSettings';
import { useDocumentTitle } from '@/hooks/useMeta';
import { useActiveAvatarNFT } from '@/hooks/useNFTHolders';

import { AllTraits } from './AllTraits';
import { AvatarComponent } from './AvatarComponent';
import { HistoryTable } from './HistoryTable';
import { NavigationPanel } from './NavigationPanel';
import { PowersInfo } from './PowersInfo';

import './AvatarSettings.scss';

export const AvatarSettings = () => {
  const { hasAvatar, avatarNFT } = useActiveAvatarNFT();
  const { isLoading } = useAvatarMetadata();
  useDocumentTitle('iSaver | Avatar settings');

  const isDataLoading = !hasAvatar || !avatarNFT || isLoading;

  return (
    <>
      <Container className="avatarSettings" variant="dashboard">
        {isDataLoading ? <div className="overlay" /> : null}
        <NavigationPanel />
        <AvatarComponent />
        <AllTraits />
        <PowersInfo />
        <HistoryTable />
      </Container>
    </>
  );
};
