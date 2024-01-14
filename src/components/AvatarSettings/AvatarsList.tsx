import { useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { OwnedNft } from 'alchemy-sdk';
import { Address } from 'wagmi';

import { useActivateAvatar } from '@/hooks/useAvatarSettings';

import { Button } from '../ui/Button/Button';

export const AvatarsList = ({ onClose, items }: { onClose: () => void; items: OwnedNft[] }) => {
  const { activateAvatar, isLoading } = useActivateAvatar();

  const handleClick = useCallback(
    (nft: OwnedNft) =>
      activateAvatar({
        collectionAddress: nft.contract.address as Address,
        tokenId: nft.tokenId,
      }).then(() => onClose()),
    [activateAvatar, onClose]
  );

  return (
    <Box className="selectionModal_list">
      {items.map((nft) => (
        <Flex key={nft.name} className="selectionModal_card">
          <img src={nft.image.thumbnailUrl || nft.image.originalUrl} alt={nft.name} />
          <Text textStyle="note">{nft.name}</Text>
          <Button isLoading={isLoading} onClick={() => handleClick(nft)} size="md">
            Activate
          </Button>
        </Flex>
      ))}
    </Box>
  );
};
