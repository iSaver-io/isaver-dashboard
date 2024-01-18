import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { Button } from '../ui/Button/Button';

type AvatarDeletionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const AvatarDeletionModal = ({ onClose, isOpen, onConfirm }: AvatarDeletionModalProps) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={500}>
        <ModalHeader justifyContent="flex-start">
          <ModalCloseButton onClick={onClose} size="lg" right="20px" top="20px" />
        </ModalHeader>
        <ModalBody>
          <Text textAlign="center" textStyle="h3" mb="20px" fontSize={{ sm: '16px', lg: '26px' }}>
            Deactivate your Avatar?
          </Text>
          <Text
            textAlign="center"
            textStyle="text2"
            color="gray.400"
            fontSize={{ sm: '12px', lg: '16px' }}
          >
            Powers Block will stop working and reset all activated Powers if the Avatar will be
            deactivated
          </Text>

          <Flex gap="14px" mt="30px" direction={{ sm: 'column', lg: 'row' }} alignItems="center">
            <Button onClick={onClose} variant="filledWhite" width={{ sm: '160px', lg: '50%' }}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="filledRed"
              borderRadius="md"
              width={{ sm: '160px', lg: '50%' }}
            >
              Deactivate
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
