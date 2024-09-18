import { FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useBreakpoint,
} from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';

type InputAmountProps = {
  total?: string | null;
  placeholder?: string;
  value?: string | number;
  hasError?: boolean | null;

  tokenTicker?: string;
  tokenIcon?: any;
  totalLabel?: string;

  onChange: (value?: string) => void;
  onSetTotal?: () => void;
};

export const InputAmount: FC<InputAmountProps> = ({
  placeholder,
  value,
  tokenIcon,
  tokenTicker,
  total,
  totalLabel = 'You have:',
  hasError,
  onChange,
  onSetTotal,
}) => {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    setLocalValue(value ? value.toString() : '');
  }, [value]);

  const handleChange = useCallback(
    (val: string) => {
      // Парсим строку к валидному числу с разделителем целой части точка (.)
      let parsedVal = '';
      let isCommaInserted = false;
      for (let i = 0; i < val.length; i++) {
        if (/\d/.test(val[i])) {
          parsedVal += val[i];
        }
        if ([',', '.'].includes(val[i]) && !isCommaInserted && parsedVal.length > 0) {
          parsedVal += '.';
          isCommaInserted = true;
        }
      }
      setLocalValue(parsedVal);
      onChange(parsedVal);
    },
    [setLocalValue, onChange]
  );

  const bp = useBreakpoint({ ssr: false });
  const isSm = bp === 'sm';
  const inputPaddingRight = tokenTicker ? (isSm ? '105px' : '150px') : undefined;
  const hasMax = Boolean(total);

  const isGreaterThanMax = total && parseFloat(localValue) > parseFloat(total);
  const isError = hasError || isGreaterThanMax;

  return (
    <Box>
      <InputGroup
        variant="secondary"
        border="3px solid"
        borderColor={isError ? 'red' : 'transparent'}
        borderRadius="md"
        boxSizing="content-box"
      >
        {tokenTicker ? (
          <InputLeftElement
            width={{ sm: '95px', md: '130px' }}
            padding={{ sm: '0 0 0 10px', md: '0 0 0 20px' }}
          >
            <Flex
              alignItems="center"
              justifyContent="flex-start"
              width="100%"
              borderRight="1px solid white"
            >
              {tokenIcon}
              <Text textStyle="textSansBold">{tokenTicker}</Text>
            </Flex>
          </InputLeftElement>
        ) : null}

        <Input
          type="string"
          color={isError ? 'red' : 'inherit'}
          placeholder={placeholder}
          value={localValue}
          paddingLeft={inputPaddingRight}
          paddingRight={hasMax ? '64px' : undefined}
          textOverflow="ellipsis"
          onChange={(e) => handleChange(e.target.value)}
        />

        {!!total && onSetTotal && (
          <InputRightElement mr="12px">
            <Button
              variant="transparent"
              color="white"
              _hover={{ opacity: 0.7 }}
              onClick={onSetTotal}
            >
              MAX
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      <Flex mt="8px" height="16px" alignItems="center" justifyContent="space-between">
        <Text textStyle="textSansExtraSmall" color="red">
          {/* {isGreaterThanMax ? 'Not enough funds' : null} */}
        </Text>
        <Text textStyle="textSansExtraSmall">
          {hasMax ? (
            <>
              {totalLabel} <span>{total}</span>
            </>
          ) : null}
        </Text>
      </Flex>
    </Box>
  );
};
