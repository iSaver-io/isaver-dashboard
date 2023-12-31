import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Center, Container } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useHasRole } from '@/hooks/admin/useHasRole';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useDocumentTitle } from '@/hooks/useMeta';

import { Addresses } from './blocks/Addresses';
import { Balances } from './blocks/Balances';
import { ExchangeControl } from './blocks/ExchangeControl';
import { LotteryControl } from './blocks/LotteryConttrol';
import { ReferralControl } from './blocks/ReferralControl';
import { SquadsControl } from './blocks/SquadsControl';
import { StakingControl } from './blocks/StakingControl';
import { StakingTVL } from './blocks/StakingTVL';
import { TicketControl } from './blocks/TicketControl';
import { TokenControl } from './blocks/TokenControl';
import { TopNotificationControl } from './blocks/TopNotificationControl';
import { VestingControl } from './blocks/VestingControl';

import 'react-datepicker/dist/react-datepicker.css';

export const AdminPanel = () => {
  useDocumentTitle('iSaver | Admin panel');

  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const isSavAdmin = useHasRole(ContractsEnum.SAV);
  const isSavRAdmin = useHasRole(ContractsEnum.SAVR);
  const isStakingAdmin = useHasRole(ContractsEnum.Staking);
  const isReferralAdmin = useHasRole(ContractsEnum.ReferralManager);
  const isSquadsAdmin = useHasRole(ContractsEnum.Squads);
  const isLotteryAdmin = useHasRole(ContractsEnum.Lottery);
  const isLotteryOperator = useHasRole(ContractsEnum.Lottery, 'operator');
  const isTicketAdmin = useHasRole(ContractsEnum.Ticket);
  const isTicketMinter = useHasRole(ContractsEnum.Ticket, 'minter');
  const isVestingAdmin = useHasRole(ContractsEnum.TokenVesting);
  const isVendorSellAdmin = useHasRole(ContractsEnum.VendorSell);

  const adminContracts = useMemo(
    () => [
      isSavAdmin,
      isSavRAdmin,
      isStakingAdmin,
      isReferralAdmin,
      isSquadsAdmin,
      isLotteryAdmin,
      isLotteryOperator,
      isVestingAdmin,
      isVendorSellAdmin,
    ],
    [
      isSavAdmin,
      isSavRAdmin,
      isStakingAdmin,
      isReferralAdmin,
      isSquadsAdmin,
      isLotteryAdmin,
      isLotteryOperator,
      isVestingAdmin,
      isVendorSellAdmin,
    ]
  );

  const isAuthLoaded = useMemo(
    () => adminContracts.every(({ isFetched }) => isFetched),
    [adminContracts]
  );
  const isAnyAdmin = useMemo(() => adminContracts.some(({ data }) => data), [adminContracts]);

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
      {isSavAdmin ? <TokenControl token={ContractsEnum.SAV} /> : null}
      {isSavRAdmin ? <TokenControl token={ContractsEnum.SAVR} /> : null}
      {isStakingAdmin ? <StakingTVL /> : null}
      {isStakingAdmin ? <StakingControl /> : null}
      {isReferralAdmin ? <ReferralControl /> : null}
      {isSquadsAdmin ? <SquadsControl /> : null}
      {isVendorSellAdmin ? <ExchangeControl /> : null}
      {isTicketAdmin || isTicketMinter ? <TicketControl /> : null}
      {isLotteryAdmin || isLotteryOperator ? <LotteryControl /> : null}
      {isVestingAdmin ? <VestingControl /> : null}
      <TopNotificationControl />
      <Addresses />
    </Container>
  );
};
