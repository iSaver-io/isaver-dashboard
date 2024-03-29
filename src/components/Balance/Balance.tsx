import { FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import { beautifyAmount, bigNumberToNumber, bigNumberToString } from '@/utils/number';

type BalanceProps = {
  isRaw?: boolean;
  label: string;
  balance?: BigNumberish | null;
  symbol?: string;
  minLimit?: BigNumberish;
  decimals?: number;
  labelWidth?: string;
};
export const Balance: FC<BalanceProps> = ({
  isRaw,
  label,
  balance,
  symbol,
  decimals,
  labelWidth = '200px',
  minLimit = 10_000,
}) => {
  const color = symbol === 'SAVR' ? 'savr' : 'sav';

  const isLowBalance = BigNumber.from(minLimit).gt(
    bigNumberToString(balance || 0, { precision: 0, decimals })
  );

  const isBalanceUnset = balance === null || balance === undefined;

  return (
    <Flex textStyle="text1" my="10px" fontSize="16px">
      <Text mr="12px" flex={`${labelWidth} 0 0`} bgColor={isLowBalance ? 'red' : undefined}>
        {label}
      </Text>

      {isBalanceUnset ? (
        <Text color={color}>---</Text>
      ) : isRaw ? (
        <Text color={color}>{BigNumber.from(balance).toNumber()}</Text>
      ) : (
        <Text color={color}>
          {balance
            ? beautifyAmount(bigNumberToNumber(balance || 0, { precision: 2, decimals }), {
                symbol,
              })
            : '---'}
        </Text>
      )}
    </Flex>
  );
};
