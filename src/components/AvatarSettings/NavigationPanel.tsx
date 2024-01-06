import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Link, Text } from '@chakra-ui/react';

import { useActiveAvatar } from '@/hooks/useAvatarSettings';
import { useNFT } from '@/hooks/useNFTHolders';

export const NavigationPanel = () => {
  const { activeAvatar } = useActiveAvatar();
  const { nft } = useNFT();

  return (
    <Box className="navigationPanel">
      <Link
        className="navigationPanel_link"
        as={RouterLink}
        to="/"
        textStyle="button"
        alignSelf="flex-start"
        mb={{ sm: '30px', '2xl': '40px' }}
      >
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>
      <div className="title">
        {activeAvatar ? (
          <>
            {activeAvatar.isAvatarCollection ? (
              <Text className="navigationPanel_name" textStyle="text2">
                {nft?.name}
              </Text>
            ) : (
              <Text textStyle="text2">{nft?.name}</Text>
            )}
          </>
        ) : null}
        <Text textStyle="h2" as="h2" textTransform="uppercase" mt={{ base: '10px', '2xl': '20px' }}>
          Avatar settings
        </Text>
      </div>
    </Box>
  );
};
