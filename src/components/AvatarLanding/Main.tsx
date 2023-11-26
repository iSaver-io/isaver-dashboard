import { useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';
import { useScrollToHash } from '@/hooks/useScrollToHash';

export const Main = () => {
  const scroll = useScrollToHash();

  const scrollToMint = useCallback(() => {
    scroll('mint');
  }, [scroll]);

  return (
    <Flex flexDirection="column" alignItems="center" paddingX={{ sm: '10px', xl: '90px' }}>
      <Text textStyle="h1" as="h1" fontSize={{ sm: '26px', md: '38px', xl: '90px' }} margin={0}>
        AVATARS
      </Text>
      <Text mt="20px" textStyle={{ sm: 'note', lg: 'text2' }} textAlign="center" maxW="842px">
        They came from <TextHighlight>deep space</TextHighlight> and settled on the&nbsp;Polygon
        blockchain to open up all the possibilities of the&nbsp;iSaver ecosystem to everyone and
        help Earthlings create a decentralized world. Each of them is unique and has a&nbsp;number
        of
        <TextHighlight>characteristics</TextHighlight> that will have an impact on success in
        the&nbsp;future NFT&nbsp;game. But for now Avatars already know how to rule the&nbsp;
        <TextHighlight>Powers</TextHighlight> that allow to increase the income of every user of
        the&nbsp;ecosystem. We're only getting started.{' '}
        <TextHighlight>It&nbsp;will&nbsp;be&nbsp;exciting!</TextHighlight>
      </Text>
      <Box mt="30px">
        <Button
          px={{ sm: '36px', xl: '56px' }}
          h={{ sm: '35px', xl: '50px' }}
          fontSize={{ sm: '12px', xl: '16px' }}
          onClick={scrollToMint}
        >
          Generate
        </Button>
      </Box>
    </Flex>
  );
};

const TextHighlight = ({ children }: { children: string }) => {
  return (
    <Text as="span" textStyle={{ sm: 'text2', xl: 'textBold' }} color="sav">
      {children}
    </Text>
  );
};
