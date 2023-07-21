import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { Balance } from '@/components/Balance/Balance';
import { useAccounts } from '@/hooks/admin/useAccounts';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useStakingMetrics } from '@/hooks/staking/useStaking';
import { useSavBalance, useSavRBalance, useUsdtBalance } from '@/hooks/useTokenBalance';
import { useTokenSupply } from '@/hooks/useTokenSupply';

export const Balances = () => {
  const { stakingPool, referralRewardPool, vendorPool, vendorChangePool, vestingPool } =
    useAccounts();

  const stakingBalance = useSavBalance(stakingPool);
  const referralBalance = useSavRBalance(referralRewardPool);
  const vendorBalance = useSavBalance(vendorPool);
  const vendorChangeBalance = useUsdtBalance(vendorChangePool);
  const vestingBalance = useSavBalance(vestingPool);
  const { tvlSav, tvlSavr } = useStakingMetrics();
  const savSupply = useTokenSupply(ContractsEnum.SAV);
  const savrSupply = useTokenSupply(ContractsEnum.SAVR);

  const isLoading =
    stakingBalance.isLoading ||
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

      <Balance label="Staking pool" balance={stakingBalance.data} symbol="SAV" />
      <Balance label="Staking TVL (SAV)" balance={tvlSav} symbol="SAV" minLimit={0} />
      <Balance label="Staking TVL (SAVR)" balance={tvlSavr} symbol="SAVR" minLimit={0} />
      <Balance label="Referral rewards pool" balance={referralBalance.data} symbol="SAVR" />
      <Balance label="Exchange pool (SAV)" balance={vendorBalance.data} symbol="SAV" />
      <Balance
        label="Exchange pool (USDT)"
        balance={vendorChangeBalance.data}
        decimals={6}
        symbol="USDT"
      />
      <Balance label="Vesting pool" balance={vestingBalance.data} symbol="SAV" />
    </AdminSection>
  );
};
