import { useCallback, useState } from 'react';
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
import { BigNumberish, OwnedNft } from 'alchemy-sdk';
import { Address } from 'wagmi';

import { useActivateAvatar } from '@/hooks/useAvatarSettings';
import { useAllowedNFTsForOwner } from '@/hooks/useNFTHolders';

import { Button } from '../ui/Button/Button';
import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';

type AvatarSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AvatarSelectionModal = ({ onClose, isOpen }: AvatarSelectionModalProps) => {
  const { activateAvatar } = useActivateAvatar();

  const { nftsForOwner, refetch, isLoading, avatarAddress } = useAllowedNFTsForOwner();

  const handleActivateAvatar = useCallback(
    (address: string, tokenId: BigNumberish) =>
      activateAvatar({
        collectionAddress: address as Address,
        tokenId,
      }).then(() => onClose()),
    [activateAvatar, onClose]
  );

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={500}>
        <ModalHeader justifyContent="flex-start">
          <Text textStyle="h3">My Avatars</Text>
          <ModalCloseButton onClick={onClose} size="lg" right="20px" top="20px" />
        </ModalHeader>
        <ModalBody>
          <Box className="selectionModal_body">
            {isLoading ? (
              <CenteredSpinner background="transparent" />
            ) : nftsForOwner.length > 0 ? (
              <Box className="selectionModal_list">
                {nftsForOwner.map((nft) => (
                  <AvatarItem
                    key={`${nft.contract.address}-${nft.tokenId}`}
                    {...nft}
                    isIsaverCollection={nft.contract.address === avatarAddress}
                    onClick={() => handleActivateAvatar(nft.contract.address, nft.tokenId)}
                  />
                ))}
              </Box>
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

const AvatarItem = ({
  name,
  image,
  onClick,
  isIsaverCollection,
}: OwnedNft & { isIsaverCollection: boolean; onClick: () => Promise<void> }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    return onClick().finally(() => setIsLoading(false));
  }, [onClick]);

  return (
    <Flex className="selectionModal_card">
      <Flex
        direction={{ sm: 'column-reverse', lg: 'row' }}
        alignItems={{ lg: 'center' }}
        gap="10px"
      >
        <img src={image.thumbnailUrl || image.originalUrl} alt={name} />
        <Text overflow="hidden" textOverflow="ellipsis" fontSize="14px">
          {isIsaverCollection ? `iSaver ${name}` : name || 'ERC721'}
        </Text>
      </Flex>
      <Button
        isLoading={isLoading}
        onClick={handleClick}
        size="md"
        alignSelf={{ sm: 'flex-end', lg: 'unset' }}
      >
        Activate
      </Button>
    </Flex>
  );
};
