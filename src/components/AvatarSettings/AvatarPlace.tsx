import { useCallback, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { useActiveAvatar, useAvatarMetadata, useDeactivateAvatar } from '@/hooks/useAvatarSettings';
import { useLogger } from '@/hooks/useLogger';
import { useActiveAvatarNFT } from '@/hooks/useNFTHolders';
import { AVATARS_URL } from '@/router';

import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';
import { ConnectWalletButton } from '../ui/ConnectWalletButton/ConnectWalletButton';

import { ReactComponent as TrashIcon } from './images/trash.svg';
import { AvatarDeletionModal } from './AvatarDeletionModal';
import { AvatarSelectionModal } from './AvatarSelectionModal';

export const AvatarPlace = () => {
  const { avatarNFT, isLoading: isNFTLoading } = useActiveAvatarNFT();
  const { activeAvatar, hasAvatar, isFetching: isActiveAvatarFetching } = useActiveAvatar();
  const { mutateAsync, isLoading: isDeactivateLoading } = useDeactivateAvatar();
  const { isConnected } = useAccount();
  const { isLoading: isMetadataLoading } = useAvatarMetadata();
  const logger = useLogger({
    event: 'settings',
    category: 'elements',
    buttonLocation: 'up',
    actionGroup: 'interactions',
    context: 'avatars',
  });

  const [isOpen, setOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const handleOpenAddAvatar = useCallback(() => {
    logger({ label: 'add_avatar', action: 'button_click' });
    setOpen(true);
  }, [logger]);

  const handleOpenDeleteModal = useCallback(() => {
    logger({ action: 'element_click', label: 'basket' });
    setDeleteOpen(true);
  }, [logger]);

  const handleCloseDeleteModal = useCallback(() => {
    logger({ action: 'button_click', label: 'cancel', buttonLocation: 'popup' });
    setDeleteOpen(false);
  }, [logger]);

  const handleDelete = useCallback(() => {
    logger({
      action: 'button_click',
      label: 'deactivate',
      buttonLocation: 'popup',
      actionGroup: 'conversions',
    });
    setDeleteOpen(false);
    mutateAsync();
  }, [mutateAsync, logger]);

  return (
    <>
      <Box
        className={[
          'avatarPlace',
          avatarNFT && hasAvatar && !activeAvatar.isAvatarCollection && 'avatarPlace_avatar',
          avatarNFT && activeAvatar.isAvatarCollection && 'avatarPlace_isaverAvatar',
        ].join(' ')}
      >
        {isActiveAvatarFetching || (hasAvatar && isNFTLoading) ? (
          <CenteredSpinner />
        ) : !hasAvatar ? (
          <>
            <Text mb="20px" textStyle="h3" textTransform="uppercase">
              Place your Avatar
            </Text>
            {isConnected ? (
              <Button rightIcon={<AddIcon />} onClick={handleOpenAddAvatar}>
                add avatar
              </Button>
            ) : (
              <ConnectWalletButton event="settings" location="up" />
            )}
            <Text textStyle="text2" mt={{ base: '20px', md: '30px' }}>
              A more detailed is{' '}
              <Link
                href={AVATARS_URL}
                color="savr"
                target="_self"
                onClick={() => logger({ action: 'link_click', label: 'here' })}
              >
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
                  onClick={handleOpenDeleteModal}
                  variant="iconButtonRed"
                  aria-label="delete avatar"
                  icon={<TrashIcon />}
                />
              </Box>
            </Box>
            {isDeactivateLoading || isMetadataLoading ? <CenteredSpinner /> : null}
          </>
        )}
      </Box>

      <AvatarSelectionModal isOpen={isOpen} onClose={() => setOpen(false)} />
      <AvatarDeletionModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
      />
    </>
  );
};
