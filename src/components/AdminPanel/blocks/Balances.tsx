import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { Balance } from '@/components/Balance/Balance';
import { useAccounts } from '@/hooks/admin/useAccounts';
import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useStakingAvailableTokens, useStakingMetrics } from '@/hooks/staking/useStaking';
import { useSavBalance, useSavRBalance, useUsdtBalance } from '@/hooks/useTokenBalance';
import { useTokenSupply } from '@/hooks/useTokenSupply';

export const Balances = () => {
  const { vestingPool } = useAccounts();
  const { Raffles, ReferralManager, VendorSell } = useContractsAddresses();

  const stakingAvailableTokensSAV = useStakingAvailableTokens(false);
  const stakingAvailableTokensSAVR = useStakingAvailableTokens(true);
  const raffleBalance = useSavRBalance(Raffles);
  const referralBalance = useSavRBalance(ReferralManager);
  const vendorBalance = useSavBalance(VendorSell);
  const vendorChangeBalance = useUsdtBalance(VendorSell);
  const vestingBalance = useSavBalance(vestingPool);
  const { tvlSav, tvlSavr, superPlansMetrics } = useStakingMetrics();
  const savSupply = useTokenSupply(ContractsEnum.SAV);
  const savrSupply = useTokenSupply(ContractsEnum.SAVR);

  const isLoading =
    stakingAvailableTokensSAV.isLoading ||
    stakingAvailableTokensSAVR.isLoading ||
    raffleBalance.isLoading ||
    referralBalance.isLoading ||
    vendorBalance.isLoading ||
    vendorChangeBalance.isLoading ||
    vestingBalance.isLoading;

  return (
    <AdminSection title="Balances" isLoading={isLoading}>
      <Balance label="SAV Total Supply" balance={savSupply.totalSupply} symbol="SAV" minLimit={0} />
      <Balance
        label="SAV Circulating Supply"
        balance={savSupply.circulatingSupply}
        symbol="SAV"
        minLimit={0}
      />
      <Balance
        label="SAV Total Burned"
        balance={savSupply.maxSupply.sub(savSupply.totalSupply)}
        symbol="SAV"
        minLimit={0}
      />

      <Balance
        label="SAVR Total Supply"
        balance={savrSupply.totalSupply}
        symbol="SAVR"
        minLimit={0}
      />
      <Balance
        label="SAVR Circulating Supply"
        balance={savrSupply.circulatingSupply}
        symbol="SAVR"
        minLimit={0}
      />
      <Balance
        label="SAVR Total Burned"
        balance={savrSupply.maxSupply.sub(savrSupply.totalSupply)}
        symbol="SAVR"
        minLimit={0}
      />

      <Balance
        label="Staking rewards balance (SAV)"
        balance={stakingAvailableTokensSAV.data}
        symbol="SAV"
      />
      <Balance
        label="Staking rewards balance (SAVR)"
        balance={stakingAvailableTokensSAVR.data}
        symbol="SAVR"
      />
      <Balance label="Staking TVL (SAV)" balance={tvlSav} symbol="SAV" minLimit={0} />
      <Balance label="Staking TVL (SAVR)" balance={tvlSavr} symbol="SAVR" minLimit={0} />
      <Balance
        label="Staking super plans TVL (SAVR)"
        balance={superPlansMetrics.tvl}
        symbol="SAVR"
        minLimit={0}
      />

      <Balance label="Referral rewards balance" balance={referralBalance.data} symbol="SAVR" />
      <Balance label="Raffle rewards balance" balance={raffleBalance.data} symbol="SAVR" />
      <Balance label="Exchange balance (SAV)" balance={vendorBalance.data} symbol="SAV" />
      <Balance
        label="Exchange balance (USDT)"
        balance={vendorChangeBalance.data}
        decimals={6}
        symbol="USDT"
      />
      <Balance label="Vesting pool" balance={vestingBalance.data} symbol="SAV" />
    </AdminSection>
  );
};
