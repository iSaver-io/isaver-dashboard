import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { OwnedNft } from 'alchemy-sdk';
import { Address } from 'wagmi';

import { useActivateAvatar } from '@/hooks/useAvatarSettings';
import { useAllowedNFTsForOwner } from '@/hooks/useNFTHolders';

export const AvatarsList = ({ onClose }: { onClose: () => void }) => {
  const { nftsForOwner } = useAllowedNFTsForOwner();

  return (
    <Box className="selectionModal_list">
      {nftsForOwner.length > 0 ? (
        nftsForOwner.map((nft) => <Card {...nft} onClose={onClose} />)
      ) : (
        <Text>You don't have available avatars</Text>
      )}
    </Box>
  );
};

interface CardProps extends OwnedNft {
  onClose: () => void;
}

export const Card = ({ name, image, tokenId, contract, onClose }: CardProps) => {
  const { activateAvatar, isLoading } = useActivateAvatar();

  return (
    <Flex key={name} className="selectionModal_card">
      <img src={image.thumbnailUrl || image.originalUrl} alt={name} />
      <Text textStyle="note">{name}</Text>
      <Button
        isLoading={isLoading}
        onClick={async () => {
          await activateAvatar({
            collectionAddress: contract.address as Address,
            tokenId,
          });
          await onClose();
        }}
        size="md"
      >
        Activate
      </Button>
    </Flex>
  );
};
