import { Box, CloseButton, Flex } from '@chakra-ui/react';

import { useTopNotification } from '@/hooks/useTopNotification';

export const TopNotification = () => {
  const { topNotification, closeNotification } = useTopNotification();

  if (!topNotification) return null;

  return (
    <Flex
      minHeight="50px"
      alignItems="center"
      justifyContent="center"
      paddingX={{ sm: '40px', lg: '70px', xl: '80px', '2xl': '150px' }}
      paddingY="8px"
      background="linear-gradient(96.85deg, #20735B -8.44%, #1A3435 102.66%)"
      boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
      position="relative"
      zIndex="100"
    >
      <Box
        className="top-notification"
        textStyle="text1"
        textAlign="center"
        fontSize={{ sm: '12px', xl: '16px' }}
        fontWeight={{ sm: '400', xl: '500' }}
      >
        <div dangerouslySetInnerHTML={{ __html: topNotification }}></div>
      </Box>

      <CloseButton
        onClick={closeNotification}
        size={{ sm: 'md', '2xl': 'lg' }}
        position="absolute"
        top="50%"
        transformOrigin="right"
        right={{ sm: '8px', lg: '20px', xl: '30px' }}
        transform="translateY(-50%)"
      />
    </Flex>
  );
};
