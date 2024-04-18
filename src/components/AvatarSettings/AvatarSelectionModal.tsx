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
  useBreakpoint,
} from '@chakra-ui/react';
import { BigNumberish, OwnedNft } from 'alchemy-sdk';
import { Address } from 'wagmi';

import { useActivateAvatar } from '@/hooks/useAvatarSettings';
import { useLogger } from '@/hooks/useLogger';
import { useAllowedNFTsForOwner } from '@/hooks/useNFTHolders';

import { Button } from '../ui/Button/Button';
import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';

type AvatarSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AvatarSelectionModal = ({ onClose, isOpen }: AvatarSelectionModalProps) => {
  const activateAvatar = useActivateAvatar();
  const { nftsForOwner, refetch, isLoading, avatarAddress } = useAllowedNFTsForOwner();
  const logger = useLogger({
    event: 'settings',
    category: 'elements',
    action: 'button_click',
    buttonLocation: 'popup',
    context: 'avatars',
  });

  const handleActivateAvatar = useCallback(
    (address: string, tokenId: BigNumberish, tokenName?: string) => {
      logger({ label: 'activate', content: tokenName || 'ERC721', actionGroup: 'conversions' });

      return activateAvatar
        .mutateAsync({
          collectionAddress: address as Address,
          tokenId,
        })
        .then(() => onClose());
    },
    [activateAvatar, onClose, logger]
  );

  const handleRefetch = useCallback(() => {
    logger({ label: 'reiterate', actionGroup: 'interactions' });
    refetch();
  }, [refetch, logger]);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ sm: '300px', md: '400px', lg: '450px' }} mx="10px">
        <ModalHeader justifyContent="flex-start">
          <Text textStyle="h3">My Avatars</Text>
          <ModalCloseButton onClick={onClose} size="lg" right="20px" top="20px" />
        </ModalHeader>
        <ModalBody>
          <Box className="selectionModal_body">
            {isLoading && nftsForOwner.length > 0 ? (
              <CenteredSpinner background="transparent" />
            ) : null}

            {nftsForOwner.length > 0 ? (
              <Box className="selectionModal_list">
                {nftsForOwner.map((nft) => (
                  <AvatarItem
                    key={`${nft.contract.address}-${nft.tokenId}`}
                    {...nft}
                    isIsaverCollection={nft.contract.address === avatarAddress}
                    onClick={() =>
                      handleActivateAvatar(nft.contract.address, nft.tokenId, nft.name)
                    }
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
                <Button isLoading={isLoading} onClick={handleRefetch}>
                  Reiterate
                </Button>
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
  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'md'].includes(bp);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    onClick().finally(() => setIsLoading(false));
  }, [onClick]);

  return (
    <Flex className="selectionModal_card">
      {isSm ? (
        <>
          <Text overflow="hidden" textOverflow="ellipsis" fontSize="14px">
            {isIsaverCollection ? `iSaver ${name}` : name || 'ERC721'}
          </Text>
          <Flex direction="row" alignItems={{ lg: 'center' }} gap="10px" width="100%">
            <img src={image.thumbnailUrl || image.originalUrl} alt={name} />
            <Button
              ml="auto"
              isLoading={isLoading}
              onClick={handleClick}
              size="md"
              alignSelf={{ sm: 'flex-end', lg: 'unset' }}
            >
              Activate
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Flex direction="row" alignItems={{ lg: 'center' }} gap="10px">
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
        </>
      )}
    </Flex>
  );
};
