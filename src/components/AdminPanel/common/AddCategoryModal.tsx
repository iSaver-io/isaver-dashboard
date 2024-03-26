import { useCallback, useState } from 'react';
import {
  Box,
  CloseButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';
import { InputAmount } from '@/components/ui/InputAmount/InputAmount';

export const AddCategoryModal = ({
  mode = 'create',
  onClose,
  onSubmit,
}: {
  mode: 'create' | 'update';
  onClose: () => void;
  onSubmit: (chance: number) => Promise<void>;
}) => {
  const [chance, setChance] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChanceChange = useCallback((val?: string) => {
    setChance(parseInt(val || ''));
  }, []);

  const handleSubmit = useCallback(() => {
    if (chance) {
      setIsLoading(true);
      onSubmit(chance)
        .then(() => onClose())
        .finally(() => setIsLoading(false));
    }
  }, [onSubmit, onClose, chance]);

  const isUpdate = mode === 'update';

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          <Text textStyle="h2">{isUpdate ? 'Update prize category' : 'Add prize category'}</Text>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Box mb={5}>
            <InputAmount placeholder="Chance weight" onChange={handleChanceChange} value={chance} />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleSubmit}
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            {isUpdate ? 'Update category' : 'Create category'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
