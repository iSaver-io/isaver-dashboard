import { useCallback, useState } from 'react';
import {
  CloseButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { isAddress } from 'ethers/lib/utils.js';

import { Button } from '@/components/ui/Button/Button';

export const RemovePrizeModal = ({
  categoryId,
  prizeId,
  onClose,
  onSubmit,
}: {
  categoryId: number;
  prizeId: number;
  onClose: () => void;
  onSubmit: (params: { categoryId: number; prizeId: number; toAddress: string }) => Promise<void>;
}) => {
  const [toAddress, setToAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    if (toAddress) {
      setIsLoading(true);
      onSubmit({ categoryId, prizeId, toAddress })
        .then(() => onClose())
        .finally(() => setIsLoading(false));
    }
  }, [onSubmit, onClose, categoryId, prizeId, toAddress]);

  const isValid = isAddress(toAddress);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          <Text textStyle="h2">Remove category prize</Text>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Text mb="24px">
            Are you sure you want to withdraw prizes from category #{categoryId} with id {prizeId}?
          </Text>
          <Input
            type="string"
            color={toAddress && !isValid ? 'red' : 'inherit'}
            placeholder="Address to which transfer prize tokens"
            value={toAddress}
            textOverflow="ellipsis"
            onChange={(e) => setToAddress(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleSubmit}
            isDisabled={isLoading || !isValid}
            isLoading={isLoading}
          >
            Withdraw prizes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
