import { Flex, Text } from '@chakra-ui/react';

export const Main = () => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      gap="20px"
      paddingX={{ sm: '10px', xl: '90px' }}
    >
      <Text textStyle="h1" as="h1" fontSize={{ sm: '26px', xl: '90px' }} margin={0}>
        AVATARS
      </Text>
      <Text textStyle="text2" textAlign="center" maxW="842px">
        They came from <TextHighlight>deep space</TextHighlight> and settled on the Polygon
        blockchain to open up all the possibilities of the iSaver ecosystem to everyone and help
        Earthlings create a decentralized world. Each of them is unique and has a number of{' '}
        <TextHighlight>characteristics</TextHighlight> that will have an impact on success in the
        future NFT game. But for now Avatars already know how to rule the{' '}
        <TextHighlight>Powers</TextHighlight> that allow to increase the income of every user of the
        ecosystem. We're only getting started. <TextHighlight>It will be exciting!</TextHighlight>
      </Text>
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
