import { Container } from '@chakra-ui/react';

import { useAvatarMetadata } from '@/hooks/useAvatarSettings';
import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';
import { useActiveAvatarNFT } from '@/hooks/useNFTHolders';

import { AllTraits } from './AllTraits';
import { AvatarComponent } from './AvatarComponent';
import { HistoryTable } from './HistoryTable';
import { NavigationPanel } from './NavigationPanel';
import { PowersInfo } from './PowersInfo';

import './AvatarSettings.scss';

export const AvatarSettings = () => {
  useDocumentTitle('iSaver | Avatar Settings');
  useMetaDescription(
    'A page where you can activate your Avatar and manage its Powers to maximize your success on the iSaver platform. Here you can see all the attributes of your Avatar, give it a name and set a username for its Telegram contact.'
  );

  const { hasAvatar, avatarNFT } = useActiveAvatarNFT();
  const { isLoading } = useAvatarMetadata();

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
