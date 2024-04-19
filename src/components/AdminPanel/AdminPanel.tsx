// eslint-disable-next-line
import { Box, Center, Container, Tab, TabList, TabPanels, TabPanel, Tabs } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useFirebaseAuth } from '@/hooks/admin/useDashboardConfigControl';
import { useDocumentTitle } from '@/hooks/useMeta';
import { useHasRole } from '@/hooks/admin/useHasRole';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';

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

  const { data: isSAVRAdmin } = useHasRole(ContractsEnum.SAVR, 'admin');
  const isTokensAdmin = isSAVRAdmin;

  const { data: isStakingAdmin } = useHasRole(ContractsEnum.Staking, 'admin');
  const { data: isReferralAdmin } = useHasRole(ContractsEnum.ReferralManager, 'admin');
  const { data: isTeamsAdmin } = useHasRole(ContractsEnum.Teams, 'admin');
  const { data: isExchangeAdmin } = useHasRole(ContractsEnum.VendorSell, 'admin');

  const { data: hasRaffleAdminRole } = useHasRole(ContractsEnum.Raffles, 'admin');
  const { data: hasRaffleOperatorRole } = useHasRole(ContractsEnum.Raffles, 'operator');
  const { data: hasTicketAdminRole } = useHasRole(ContractsEnum.Ticket, 'admin');
  const { data: hasTicketMinterRole } = useHasRole(ContractsEnum.Ticket, 'minter');
  const isRaffleAdmin =
    hasRaffleAdminRole || hasRaffleOperatorRole || hasTicketAdminRole || hasTicketMinterRole;

  const { data: hasMomentoAdminRole } = useHasRole(ContractsEnum.Momento, 'admin');
  const { data: hasMomentoTokensPoolAdminRole } = useHasRole(
    ContractsEnum.MomentoTokensPool,
    'admin'
  );
  const isMomentoAdmin = hasMomentoAdminRole || hasMomentoTokensPoolAdminRole;

  const { data: hasPowersAdminRole } = useHasRole(ContractsEnum.ISaverPowers, 'admin');
  const { data: hasPowersMinterRole } = useHasRole(ContractsEnum.ISaverPowers, 'minter');
  const isPowersAdmin = hasPowersAdminRole || hasPowersMinterRole;

  const { data: hasAvatarSettingsAdminRole } = useHasRole(ContractsEnum.AvatarSettings, 'admin');
  const { data: hasBirthdayTokensPoolAdminRole } = useHasRole(
    ContractsEnum.BirthdayTokensPool,
    'admin'
  );
  const isAvatarSettingsAdmin = hasAvatarSettingsAdminRole || hasBirthdayTokensPoolAdminRole;

  const { data: isAvatarSellAdmin } = useHasRole(ContractsEnum.AvatarsSell, 'admin');

  const { data: isVestingAdmin } = useHasRole(ContractsEnum.TokenVesting, 'admin');

  if (!isAdmin || !isConnected) {
    return (
      <Box height="95vh" position="relative">
        <Center height="400px">
          <Box display="flex" flexDirection="column" gap="24px">
            {isConnected ? null : <ConnectWalletButton />}
            {isAdmin ? null : isAuthorized ? (
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
      <Tabs isLazy>
        <TabList>
          {isAdmin ? <Tab>Balances</Tab> : null}
          {isTokensAdmin ? <Tab>Tokens</Tab> : null}
          {isStakingAdmin ? <Tab>Staking</Tab> : null}
          {isReferralAdmin ? <Tab>Referral</Tab> : null}
          {isTeamsAdmin ? <Tab>Teams</Tab> : null}
          {isExchangeAdmin ? <Tab>Exchange</Tab> : null}
          {isRaffleAdmin ? <Tab>Raffles/Ticket</Tab> : null}
          {isMomentoAdmin ? <Tab>Momento</Tab> : null}
          {isPowersAdmin ? <Tab>Powers</Tab> : null}
          {isAvatarSettingsAdmin ? <Tab>Avatars Settings</Tab> : null}
          {isAvatarSellAdmin ? <Tab>Avatars Sell</Tab> : null}
          {isVestingAdmin ? <Tab>Vesting</Tab> : null}
          {isAdmin ? <Tab>Top notification</Tab> : null}
        </TabList>

        <TabPanels>
          {isAdmin ? (
            <TabPanel>
              <Balances />
            </TabPanel>
          ) : null}
          {isTokensAdmin ? (
            <TabPanel>
              <TokensControl />
            </TabPanel>
          ) : null}
          {isStakingAdmin ? (
            <TabPanel>
              <StakingTVL />
              <StakingControl />
            </TabPanel>
          ) : null}
          {isReferralAdmin ? (
            <TabPanel>
              <ReferralControl />
            </TabPanel>
          ) : null}
          {isTeamsAdmin ? (
            <TabPanel>
              <TeamsControl />
            </TabPanel>
          ) : null}
          {isExchangeAdmin ? (
            <TabPanel>
              <ExchangeControl />
            </TabPanel>
          ) : null}
          {isRaffleAdmin ? (
            <TabPanel>
              <TicketControl />
              <RaffleControl />
            </TabPanel>
          ) : null}
          {isMomentoAdmin ? (
            <TabPanel>
              <MomentoControl />
            </TabPanel>
          ) : null}
          {isPowersAdmin ? (
            <TabPanel>
              <PowersControl />
            </TabPanel>
          ) : null}
          {isAvatarSettingsAdmin ? (
            <TabPanel>
              <AvatarSettingsControl />
            </TabPanel>
          ) : null}
          {isAvatarSellAdmin ? (
            <TabPanel>
              <AvatarsSellControl />
            </TabPanel>
          ) : null}
          {isVestingAdmin ? (
            <TabPanel>
              <VestingControl />
            </TabPanel>
          ) : null}
          {isAdmin ? (
            <TabPanel>
              <TopNotificationControl />
            </TabPanel>
          ) : null}
        </TabPanels>
      </Tabs>

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
