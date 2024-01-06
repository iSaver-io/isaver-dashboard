import { Link as RouterLink } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Link, Text } from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';
import { useDeactivateAvatar } from '@/hooks/useAvatarSettings';
import { useNFT } from '@/hooks/useNFTHolders';

import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';

import TrashIcon from './images/trash.svg';

type AvatarPlaceProps = {
  onOpen: () => void;
};

export const AvatarPlace = ({ onOpen }: AvatarPlaceProps) => {
  const { nft, isNFTCorrect, isLoading: isNFTMetadataLoading } = useNFT();
  const { mutateAsync, isLoading: isDeactivateLoading, isSuccess } = useDeactivateAvatar();

  if (!isSuccess && isNFTMetadataLoading) {
    return (
      <Box className="avatarPlace">
        <CenteredSpinner />
      </Box>
    );
  }

  return (
    <Box className="avatarPlace">
      {!isNFTCorrect ? (
        <>
          <Text textStyle="h3" textTransform="uppercase">
            Place your Avatar
          </Text>
          <Button mt="20px" rightIcon={<AddIcon />} onClick={onOpen}>
            add avatar
          </Button>
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
            <img className="avatarPlace_image" src={nft?.image.originalUrl} alt={nft?.name} />
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
