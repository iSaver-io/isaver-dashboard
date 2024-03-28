import { FC, useCallback, useState } from 'react';
import {
  Box,
  CloseButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';
import { POWERS_LIST } from '@/hooks/usePowers';

type MintPowersProps = {
  onClose: () => void;
  onSubmit: ({
    tokenId,
    toAddress,
    amount,
  }: {
    tokenId: number;
    toAddress: string;
    amount: number;
  }) => Promise<void>;
};
export const MintPowers: FC<MintPowersProps> = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [tokenId, setTokenId] = useState<number>();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<number>();

  const handleSubmit = useCallback(() => {
    if (!address || !amount || tokenId === undefined) return;

    setIsLoading(true);
    onSubmit({ tokenId, toAddress: address, amount })
      .then(onClose)
      .finally(() => setIsLoading(false));
  }, [address, amount, tokenId, onSubmit, onClose]);

  const handleSelect = useCallback((val: any) => {
    setTokenId(val.target.value);
  }, []);

  const isDataValid = address && amount && tokenId !== undefined;

  return (
    <Modal isOpen isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          Mint Powers
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Box mb="20px">
            <Select placeholder="Select option" size="md" onChange={handleSelect}>
              {POWERS_LIST.map((power, index) => (
                <option key={index} value={index}>
                  Power {power}
                </option>
              ))}
            </Select>
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Address:
            </Text>
            <Input placeholder="0x..." onChange={(e) => setAddress(e.target.value)} />
          </Box>
          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Amount of tokens:
            </Text>
            <Input
              type="number"
              placeholder="0"
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            isLoading={isLoading}
            isDisabled={!isDataValid || isLoading}
            onClick={handleSubmit}
          >
            Mint Powers
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
