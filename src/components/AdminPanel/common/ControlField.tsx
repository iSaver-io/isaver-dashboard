import { FC, useCallback, useEffect, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Input, Switch, Text, Textarea } from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';

type FieldType = 'input' | 'textarea';

// TODO: use generic instead of any
type ControlFieldProps = {
  label: string;
  labelWidth?: string;
  tip?: string;
  value?: any;
  placeholder?: string;
  type?: FieldType;
  onSubmit: (val: any) => Promise<void>;
};
export const ControlField: FC<ControlFieldProps> = ({
  label,
  labelWidth,
  tip,
  value,
  placeholder,
  type = 'input',
  onSubmit,
}) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const isBooleanField = typeof value === 'boolean';

  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  const handleChange = useCallback((e: any) => {
    setLocalValue(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    onSubmit(localValue).finally(() => setIsLoading(false));
  }, [onSubmit, localValue]);

  const isEnabled = (localValue || value) && localValue !== value;
  const isTextarea = type === 'textarea';

  return (
    <Flex alignItems={isTextarea ? 'top' : 'center'} mb="12px">
      <Box minWidth={labelWidth || '200px'}>
        <Text textStyle="text1" lineHeight="30px">
          {label}:
        </Text>
        <Text textStyle="textSansExtraSmall" opacity={0.5} lineHeight="10px">
          {tip}
        </Text>
      </Box>

      <Box ml="16px">
        {isBooleanField ? (
          <Switch colorScheme="teal" size="lg" isChecked={value} onChange={handleChange} />
        ) : type === 'input' ? (
          <Input
            size="md"
            minWidth="200px"
            variant="primary"
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
          />
        ) : (
          <Textarea
            variant="primary"
            resize="both"
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
          />
        )}
      </Box>

      <Box ml="16px">
        <IconButton
          size="sm"
          variant="filledRed"
          aria-label="reset"
          isDisabled={!isEnabled}
          icon={<DeleteIcon />}
          onClick={() => setLocalValue(value)}
        />
        <Button
          isDisabled={!isEnabled}
          isLoading={isLoading}
          size="sm"
          ml="12px"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Flex>
  );
};
