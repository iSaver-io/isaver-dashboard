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
  const { Lottery, ReferralManager, VendorSell } = useContractsAddresses();

  const stakingAvailableTokens = useStakingAvailableTokens();
  const lotteryBalance = useSavRBalance(Lottery);
  const referralBalance = useSavRBalance(ReferralManager);
  const vendorBalance = useSavBalance(VendorSell);
  const vendorChangeBalance = useUsdtBalance(VendorSell);
  const vestingBalance = useSavBalance(vestingPool);
  const { tvlSav, tvlSavr } = useStakingMetrics();
  const savSupply = useTokenSupply(ContractsEnum.SAV);
  const savrSupply = useTokenSupply(ContractsEnum.SAVR);

  const isLoading =
    stakingAvailableTokens.isLoading ||
    lotteryBalance.isLoading ||
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

      <Balance label="Staking rewards balance" balance={stakingAvailableTokens.data} symbol="SAV" />
      <Balance label="Staking TVL (SAV)" balance={tvlSav} symbol="SAV" minLimit={0} />
      <Balance label="Staking TVL (SAVR)" balance={tvlSavr} symbol="SAVR" minLimit={0} />
      <Balance label="Lottery rewards balance" balance={lotteryBalance.data} symbol="SAVR" />
      <Balance label="Referral rewards balance" balance={referralBalance.data} symbol="SAVR" />
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
