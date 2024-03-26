import { Box, Center, Container } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useFirebaseAuth } from '@/hooks/admin/useDashboardConfigControl';
import { useDocumentTitle } from '@/hooks/useMeta';

import { Addresses } from './blocks/Addresses';
import { AvatarSettingsControl } from './blocks/AvatarSettingsControl';
import { AvatarsSellControl } from './blocks/AvatarsSellControl';
import { Balances } from './blocks/Balances';
import { ExchangeControl } from './blocks/ExchangeControl';
import { MomentoControl } from './blocks/MomentoControl';
import { PowersControl } from './blocks/PowersControl';
import { RaffleControl } from './blocks/RaffleControl';
import { ReferralControl } from './blocks/ReferralControl';
import { StakingControl } from './blocks/StakingControl';
import { StakingTVL } from './blocks/StakingTVL';
import { TeamsControl } from './blocks/TeamsControl';
import { TicketControl } from './blocks/TicketControl';
import { TokensControl } from './blocks/TokensControl';
import { TopNotificationControl } from './blocks/TopNotificationControl';
import { VestingControl } from './blocks/VestingControl';
import { AdminSection } from './common/AdminSection';

import 'react-datepicker/dist/react-datepicker.css';

export const AdminPanel = () => {
  useDocumentTitle('iSaver | Admin panel');

  const { isConnected } = useAccount();
  const { isAuthorized, isAdmin, signIn, signOut } = useFirebaseAuth();

  if (!isAdmin || !isConnected) {
    return (
      <Box height="95vh" position="relative">
        <Center height="400px">
          <Box display="flex" flexDirection="column" gap="24px">
            {isConnected ? null : <ConnectWalletButton />}
            {isAuthorized ? (
              <Button onClick={signOut}>Log in via Admin Google account</Button>
            ) : (
              <Button onClick={signIn}>Log in with Google</Button>
            )}
          </Box>
        </Center>
      </Box>
    );
  }

  return (
    <Container variant="dashboard" padding="40px 0 80px" minWidth="container.xl">
      <Balances />
      <TokensControl />
      <StakingTVL />
      <StakingControl />
      <ReferralControl />
      <TeamsControl />
      <ExchangeControl />
      <TicketControl />
      <RaffleControl />
      <PowersControl />
      <AvatarSettingsControl />
      <MomentoControl />
      <AvatarsSellControl />
      <VestingControl />

      <TopNotificationControl />

      <AdminSection title="Authentication">
        <Button size="sm" onClick={signOut}>
          Log out from Google
        </Button>
      </AdminSection>

      <Addresses />
    </Container>
  );
};

export default AdminPanel;
