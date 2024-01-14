import { Link as RouterLink } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Link, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { useDeactivateAvatar } from '@/hooks/useAvatarSettings';
import { useActiveAvatarNFT } from '@/hooks/useNFTHolders';

import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';
import { ConnectWalletButton } from '../ui/ConnectWalletButton/ConnectWalletButton';

import TrashIcon from './images/trash.svg';

type AvatarPlaceProps = {
  onOpen: () => void;
};

export const AvatarPlace = ({ onOpen }: AvatarPlaceProps) => {
  const {
    avatarNFT,
    hasAvatar,
    isLoading: isNFTMetadataLoading,
    isFetching: isNFTMetadataFetching,
  } = useActiveAvatarNFT();
  const { mutateAsync, isLoading: isDeactivateLoading, isSuccess } = useDeactivateAvatar();
  const { isConnected } = useAccount();

  if (!isSuccess && isNFTMetadataLoading && isNFTMetadataFetching) {
    return (
      <Box className="avatarPlace">
        <CenteredSpinner />
      </Box>
    );
  }

  return (
    <Box className="avatarPlace">
      {!hasAvatar ? (
        <>
          <Text mb="20px" textStyle="h3" textTransform="uppercase">
            Place your Avatar
          </Text>
          {isConnected ? (
            <Button rightIcon={<AddIcon />} onClick={onOpen}>
              add avatar
            </Button>
          ) : (
            <ConnectWalletButton />
          )}
          <Text textStyle="text2" mt={{ base: '20px', md: '30px' }}>
            A more detailed is{' '}
            <Link as={RouterLink} to="/" color="savr">
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
            <button className="avatarPlace_trash" onClick={() => mutateAsync()}>
              <img src={TrashIcon} alt="trash" />
            </button>
          </Box>
          {isDeactivateLoading ? <CenteredSpinner /> : null}
        </>
      )}
    </Box>
  );
};
