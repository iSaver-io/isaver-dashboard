import { Box, Flex, Text } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { useAccounts } from '@/hooks/admin/useAccounts';
import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useStakingAvailableTokens, useStakingMetrics } from '@/hooks/staking/useStaking';
import { useSavBalance, useSavRBalance, useUsdtBalance } from '@/hooks/useTokenBalance';
import { useTokenSupply } from '@/hooks/useTokenSupply';
import { beautifyAmount, bigNumberToNumber, bigNumberToString } from '@/utils/number';

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
      <BalanceRow label="Total Supply" sav={savSupply.totalSupply} savr={savrSupply.totalSupply} />
      <BalanceRow
        label="Circulating Supply"
        sav={savSupply.circulatingSupply}
        savr={savrSupply.circulatingSupply}
      />
      <BalanceRow
        label="Total Burned"
        sav={savSupply.maxSupply.sub(savSupply.totalSupply)}
        savr={savrSupply.maxSupply.sub(savrSupply.totalSupply)}
      />

      <BalanceRow label="Staking TVL" sav={tvlSav} savr={tvlSavr} />
      <BalanceRow label="Staking B Power TVL" savr={superPlansMetrics.tvl} />

      <BalanceRow
        label="Staking Rewards Treasury"
        sav={stakingAvailableTokensSAV.data}
        savMinLimit={10_000}
        savr={stakingAvailableTokensSAVR.data}
        savrMinLimit={10_000}
      />

      <BalanceRow
        label="Referral Rewards Treasury"
        savr={referralBalance.data || 0}
        savrMinLimit={10_000}
      />
      <BalanceRow
        label="Raffle Rewards Treasury"
        savr={raffleBalance.data || 0}
        savrMinLimit={10_000}
      />
      <BalanceRow
        label="Exchange Treasury"
        sav={vendorBalance.data || 0}
        usdt={vendorChangeBalance.data || 0}
      />
      <BalanceRow label="Vesting Pool" sav={vestingBalance.data || 0} />
    </AdminSection>
  );
};

type BalanceRowProps = {
  label: string;
  sav?: BigNumberish;
  savr?: BigNumberish;
  usdt?: BigNumberish;

  savMinLimit?: BigNumberish;
  savrMinLimit?: BigNumberish;
  usdtMinLimit?: BigNumberish;
};
const BalanceRow = ({
  label,
  sav,
  savr,
  usdt,
  savMinLimit,
  savrMinLimit,
  usdtMinLimit,
}: BalanceRowProps) => {
  const isLowBalanceSAV = Boolean(
    sav !== undefined &&
      savMinLimit !== undefined &&
      BigNumber.from(savMinLimit).gt(bigNumberToString(sav || 0, { precision: 0 }))
  );
  const isLowBalanceSAVR = Boolean(
    savr !== undefined &&
      savrMinLimit !== undefined &&
      BigNumber.from(savrMinLimit).gt(bigNumberToString(savr || 0, { precision: 0 }))
  );
  const isLowBalanceUSDT = Boolean(
    usdt !== undefined &&
      usdtMinLimit !== undefined &&
      BigNumber.from(usdtMinLimit).gt(bigNumberToString(usdt || 0, { precision: 0, decimals: 6 }))
  );

  return (
    <Flex textStyle="text1" my="10px" fontSize="18px">
      <Text mr="12px" flex="260px 0 0">
        {label}
      </Text>

      <BalanceCell balance={sav} isLow={isLowBalanceSAV} color="sav" decimals={18} symbol="SAV" />
      <BalanceCell
        balance={savr}
        isLow={isLowBalanceSAVR}
        color="savr"
        decimals={18}
        symbol="SAVR"
      />
      <BalanceCell balance={usdt} isLow={isLowBalanceUSDT} color="sav" decimals={6} symbol="USDT" />
    </Flex>
  );
};

type BalanceCellProps = {
  balance?: BigNumberish;
  isLow?: boolean;
  color: 'sav' | 'savr';
  decimals: number;
  symbol?: string;
};
const BalanceCell = ({
  balance,
  isLow,
  symbol,
  color = 'sav',
  decimals = 18,
}: BalanceCellProps) => {
  const isBalanceUnset = balance === null || balance === undefined;

  return (
    <Box flexBasis="300px" mx="8px" px="8px" bgColor={isLow ? 'red' : undefined}>
      {isBalanceUnset ? null : (
        <Text color={color}>
          {beautifyAmount(bigNumberToNumber(balance || 0, { precision: 2, decimals }))} {symbol}
        </Text>
      )}
    </Box>
  );
};
