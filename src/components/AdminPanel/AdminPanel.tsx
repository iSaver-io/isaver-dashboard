import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Center, Container } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useDashboardConfigControl } from '@/hooks/admin/useDashboardConfigControl';
import { useHasRole } from '@/hooks/admin/useHasRole';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useDocumentTitle } from '@/hooks/useMeta';

import { Addresses } from './blocks/Addresses';
import { AvatarsSellControl } from './blocks/AvatarsSellControl';
import { Balances } from './blocks/Balances';
import { ExchangeControl } from './blocks/ExchangeControl';
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

  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const isSavAdmin = useHasRole(ContractsEnum.SAV);
  const isSavRAdmin = useHasRole(ContractsEnum.SAVR);
  const isStakingAdmin = useHasRole(ContractsEnum.Staking);
  const isReferralAdmin = useHasRole(ContractsEnum.ReferralManager);
  const isTeamsAdmin = useHasRole(ContractsEnum.Teams);
  const isRaffleAdmin = useHasRole(ContractsEnum.Raffles);
  const isRaffleOperator = useHasRole(ContractsEnum.Raffles, 'operator');
  const isTicketAdmin = useHasRole(ContractsEnum.Ticket);
  const isTicketMinter = useHasRole(ContractsEnum.Ticket, 'minter');
  const isVestingAdmin = useHasRole(ContractsEnum.TokenVesting);
  const isVendorSellAdmin = useHasRole(ContractsEnum.VendorSell);
  const isAvatarsSellAdmin = useHasRole(ContractsEnum.AvatarsSell);

  const adminContracts = useMemo(
    () => [
      isSavAdmin,
      isSavRAdmin,
      isStakingAdmin,
      isReferralAdmin,
      isTeamsAdmin,
      isRaffleAdmin,
      isRaffleOperator,
      isVestingAdmin,
      isVendorSellAdmin,
      isAvatarsSellAdmin,
    ],
    [
      isSavAdmin,
      isSavRAdmin,
      isStakingAdmin,
      isReferralAdmin,
      isTeamsAdmin,
      isRaffleAdmin,
      isRaffleOperator,
      isVestingAdmin,
      isVendorSellAdmin,
      isAvatarsSellAdmin,
    ]
  );

  const isAuthLoaded = useMemo(
    () => adminContracts.every(({ isFetched }) => isFetched),
    [adminContracts]
  );
  const isAnyAdmin = useMemo(() => adminContracts.some(({ data }) => data), [adminContracts]);
  const { isAuthorized, signIn, signOut } = useDashboardConfigControl();

  useEffect(() => {
    if (isConnected && isAuthLoaded && !isAnyAdmin) {
      navigate('/');
    }
  }, [isConnected, isAuthLoaded, isAnyAdmin, navigate]);

  if (!isAuthLoaded) {
    return (
      <Box height="95vh" position="relative">
        {isConnected ? (
          <CenteredSpinner />
        ) : (
          <Center height="100%">
            <ConnectWalletButton />
          </Center>
        )}
      </Box>
    );
  }

  return (
    <Container variant="dashboard" padding="40px 0 80px" minWidth="container.xl">
      <Balances />
      {isSavAdmin || isSavRAdmin ? <TokensControl /> : null}
      {isStakingAdmin ? <StakingTVL /> : null}
      {isStakingAdmin ? <StakingControl /> : null}
      {isReferralAdmin ? <ReferralControl /> : null}
      {isTeamsAdmin ? <TeamsControl /> : null}
      {isVendorSellAdmin ? <ExchangeControl /> : null}
      {isTicketAdmin || isTicketMinter ? <TicketControl /> : null}
      {isRaffleAdmin || isRaffleOperator ? <RaffleControl /> : null}
      {isVestingAdmin ? <VestingControl /> : null}
      {isAvatarsSellAdmin ? <AvatarsSellControl /> : null}
      <TopNotificationControl />
      <AdminSection title="Database authentication">
        {isAuthorized ? (
          <Button size="sm" onClick={signOut}>
            Log out from Google
          </Button>
        ) : (
          <Button size="sm" onClick={signIn}>
            Log in with Google
          </Button>
        )}
      </AdminSection>

      <Addresses />
    </Container>
  );
};

export default AdminPanel;
