import { BigNumberish, ethers } from 'ethers';

export const bigNumberToString = (
  value: BigNumberish,
  {
    decimals = 18,
    precision = 2,
  }: {
    decimals?: number;
    precision?: number;
  } = {}
) => {
  const parts = ethers.utils.formatUnits(value, decimals).split('.');
  let fractional = parts[1].slice(0, precision).padEnd(precision, '0');
  return fractional ? `${parts[0]}.${fractional}` : `${parts[0]}`;
};

export const bigNumberToNumber = (
  value: BigNumberish,
  {
    decimals = 18,
    precision = 2,
  }: {
    decimals?: number;
    precision?: number;
  } = {}
) => {
  const stringValue = bigNumberToString(value, { decimals, precision });
  return parseFloat(stringValue);
};

export const getYearlyAPR = (apr: string | number) => {
  return parseFloat(apr.toString()).toFixed(2);
};

export const getReadableAmount = (
  amount: BigNumberish,
  {
    decimals = 18,
    precision = 2,
    shortify = false,
    prettify = false,
  }: {
    decimals?: number;
    precision?: number;
    shortify?: boolean;
    prettify?: boolean;
  } = {}
) => {
  const realAmount = parseFloat(ethers.utils.formatUnits(amount, decimals));
  const shortAmount = shortify ? realAmount * 10 : realAmount;

  if (shortAmount < 1000) return beautifyAmount(realAmount, { precision });
  if (shortAmount < 1000000)
    return beautifyAmount(realAmount / 1000, { symbol: 'k', prettify, precision });

  return beautifyAmount(realAmount / 1000000, { symbol: 'M', prettify, precision });
};

export const makeBigNumber = (value: BigNumberish, decimals: number = 18) => {
  return ethers.utils.parseUnits(value.toString(), decimals);
};

export const beautifyAmount = (
  amount: number,
  {
    symbol,
    prettify = true,
    precision = 2,
  }: {
    symbol?: string;
    prettify?: boolean;
    precision?: number;
  } = {}
) => {
  const amountParsed = amount.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  let amountBeautified = amountParsed.replaceAll(',', prettify ? ' ' : '');
  if (symbol) {
    amountBeautified += prettify ? ` ${symbol}` : symbol;
  }

  return amountBeautified;
};
