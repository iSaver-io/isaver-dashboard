import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { useNFTsForOwner } from '@/hooks/useNFTHolders';

import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';

import { AvatarsList } from './AvatarsList';

type AvatarSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AvatarSelectionModal = ({ onClose, isOpen }: AvatarSelectionModalProps) => {
  const { isLoading } = useNFTsForOwner();

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={500}>
        <ModalHeader justifyContent="flex-start">
          <Text textStyle="h3">My avatars</Text>
          <ModalCloseButton onClick={onClose} size="lg" right="20px" top="20px" />
        </ModalHeader>
        <ModalBody>
          <Box className="selectionModal_body">
            {isLoading ? (
              <CenteredSpinner background="transparent" />
            ) : (
              <AvatarsList onClose={onClose} />
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
