import { useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { useActiveAvatar, useDeactivateAvatar } from '@/hooks/useAvatarSettings';
import { useActiveAvatarNFT } from '@/hooks/useNFTHolders';
import { AVATARS_URL } from '@/router';

import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';
import { ConnectWalletButton } from '../ui/ConnectWalletButton/ConnectWalletButton';

import { ReactComponent as TrashIcon } from './images/trash.svg';
import { AvatarDeletionModal } from './AvatarDeletionModal';
import { AvatarSelectionModal } from './AvatarSelectionModal';

export const AvatarPlace = () => {
  const {
    avatarNFT,
    hasAvatar,
    isLoading: isNFTMetadataLoading,
    isFetching: isNFTMetadataFetching,
  } = useActiveAvatarNFT();
  const { activeAvatar } = useActiveAvatar();
  const { mutateAsync, isLoading: isDeactivateLoading, isSuccess } = useDeactivateAvatar();
  const { isConnected } = useAccount();

  const [isOpen, setOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = useCallback(() => {
    setDeleteOpen(false);
    mutateAsync();
  }, [mutateAsync]);

  if (!isSuccess && isNFTMetadataLoading && isNFTMetadataFetching) {
    return (
      <Box className="avatarPlace">
        <CenteredSpinner />
      </Box>
    );
  }

  return (
    <>
      <Box
        className={[
          'avatarPlace',
          avatarNFT && hasAvatar && !activeAvatar.isAvatarCollection && 'avatarPlace_avatar',
          avatarNFT && activeAvatar.isAvatarCollection && 'avatarPlace_isaverAvatar',
        ].join(' ')}
      >
        {!hasAvatar ? (
          <>
            <Text mb="20px" textStyle="h3" textTransform="uppercase">
              Place your Avatar
            </Text>
            {isConnected ? (
              <Button rightIcon={<AddIcon />} onClick={() => setOpen(true)}>
                add avatar
              </Button>
            ) : (
              <ConnectWalletButton />
            )}
            <Text textStyle="text2" mt={{ base: '20px', md: '30px' }}>
              A more detailed is{' '}
              <Link as={RouterLink} to={AVATARS_URL} color="savr" target="_blank">
                here
              </Link>
            </Text>
          </>
        ) : (
          <>
            <Box>
              <img
                className="avatarPlace_image"
                src={avatarNFT?.image.originalUrl}
                alt={avatarNFT?.name}
              />
              <Box className="avatarPlace_trash">
                <IconButton
                  onClick={() => setDeleteOpen(true)}
                  variant="iconButtonRed"
                  aria-label="delete avatar"
                  icon={<TrashIcon />}
                />
              </Box>
            </Box>
            {isDeactivateLoading ? <CenteredSpinner /> : null}
          </>
        )}
      </Box>

      <AvatarSelectionModal isOpen={isOpen} onClose={() => setOpen(false)} />
      <AvatarDeletionModal
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};
