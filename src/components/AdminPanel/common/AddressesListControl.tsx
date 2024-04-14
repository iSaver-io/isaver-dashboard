import { useCallback, useMemo, useState } from 'react';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { isAddress } from 'ethers/lib/utils.js';

import { Button } from '@/components/ui/Button/Button';

type AddressesListControlProps = {
  addresses: string[];
  label: string;
  addActionLabel: string;
  removeActionLabel: string;
  listLabel: string;

  onAdd: (address: string) => Promise<void>;
  onRemove: (address: string) => Promise<void>;
};
export const AddressesListControl = ({
  addresses,
  listLabel,
  label,
  addActionLabel,
  removeActionLabel,
  onAdd,
  onRemove,
}: AddressesListControlProps) => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [address, setAddress] = useState<string>();

  const isValidAddress = useMemo(() => isAddress(address || ''), [address]);
  const isExistingAddress = useMemo(
    () =>
      addresses
        .map((c) => c.toLowerCase())
        .includes((address || '').toLowerCase() as unknown as any),
    [addresses, address]
  );

  const handleAction = useCallback(() => {
    if (isValidAddress && address) {
      setIsLoading(true);
      (isExistingAddress ? onRemove : onAdd)(address)
        .then(() => setAddress(''))
        .finally(() => setIsLoading(false));
    }
  }, [isValidAddress, address, isExistingAddress, onAdd, onRemove]);

  return (
    <>
      <Flex alignItems={'center'} mt="12px">
        <Text textStyle="text1" lineHeight="30px">
          {label}:
        </Text>

        <Box ml="16px">
          <Input
            size="md"
            minWidth="200px"
            variant="primary"
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            placeholder="Address"
          />
        </Box>

        <Button
          ml="16px"
          isDisabled={!isValidAddress}
          isLoading={isLoading}
          size="sm"
          onClick={handleAction}
        >
          {isExistingAddress ? removeActionLabel : addActionLabel}
        </Button>
      </Flex>
      <Text fontWeight="500" my="8px" fontSize="18px">
        {listLabel} ({addresses.length}):
      </Text>
      <Flex mb="16px" direction="column">
        {addresses.map((address) => (
          <Box key={address} textStyle="text1" color="gray.400">
            {address}
          </Box>
        ))}
      </Flex>
    </>
  );
};
