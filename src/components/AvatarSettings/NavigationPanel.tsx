import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Link, Text } from '@chakra-ui/react';

import { useActiveAvatar } from '@/hooks/useAvatarSettings';
import { useLogger } from '@/hooks/useLogger';
import { useActiveAvatarNFT } from '@/hooks/useNFTHolders';

export const NavigationPanel = () => {
  const { activeAvatar, hasAvatar } = useActiveAvatar();
  const { avatarNFT } = useActiveAvatarNFT();
  const logger = useLogger({
    event: 'settings',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'up',
    actionGroup: 'interactions',
  });

  const name = useMemo(() => {
    if (hasAvatar) {
      if (activeAvatar?.isAvatarCollection) {
        return avatarNFT?.name?.split(' ')[1];
      } else {
        return avatarNFT?.name;
      }
    }
    return 'ERC721';
  }, [avatarNFT, activeAvatar, hasAvatar]);

  return (
    <Box className="navigationPanel">
      <Link
        className="navigationPanel_link"
        as={RouterLink}
        to="/"
        onClick={() => logger({ label: 'back' })}
        textStyle="button"
        alignSelf="flex-start"
        mb={{ sm: '30px', '2xl': '40px' }}
      >
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>
      <div className="title">
        {hasAvatar && name ? (
          <>
            {activeAvatar?.isAvatarCollection ? (
              <Text className="navigationPanel_name" textStyle="text2">
                {name}
              </Text>
            ) : (
              <Text textStyle="text2" fontSize="16px">
                {name}
              </Text>
            )}
          </>
        ) : null}
        <Text
          textStyle="h2"
          as="h2"
          textTransform="uppercase"
          mt={activeAvatar?.isAvatarCollection ? '20px' : { sm: '10px', xl: '15px', '2xl': '25px' }}
        >
          Avatar settings
        </Text>
      </div>
    </Box>
  );
};
