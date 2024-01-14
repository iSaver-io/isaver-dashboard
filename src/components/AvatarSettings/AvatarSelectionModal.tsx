import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { useAllowedNFTsForOwner } from '@/hooks/useNFTHolders';

import { Button } from '../ui/Button/Button';
import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';

import { AvatarsList } from './AvatarsList';

type AvatarSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AvatarSelectionModal = ({ onClose, isOpen }: AvatarSelectionModalProps) => {
  const { nftsForOwner, refetch, isLoading } = useAllowedNFTsForOwner();

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
            ) : nftsForOwner.length > 0 ? (
              <AvatarsList onClose={onClose} items={nftsForOwner} />
            ) : (
              <Flex grow="1" direction="column" alignItems="center" justifyContent="center">
                <Text mb="30px" color="gray.400" textStyle="text2">
                  No available Avatars found.
                  <br />
                  Retry again or return later
                </Text>
                <Button onClick={() => refetch()}>Reiterate</Button>
              </Flex>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
