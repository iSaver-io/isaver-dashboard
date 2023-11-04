import { Link } from 'react-router-dom';
import { Button, Flex, Text } from '@chakra-ui/react';

export const MintAvatar = () => {
  return (
    <Flex flexDirection="column" alignItems="center">
      <Text textStyle="h2" as="h2" textTransform="uppercase" textAlign="center">
        generate your avatar
      </Text>
      <Flex gap={{ base: '5px', xl: '15px' }} mt="20px">
        <Text textStyle="sectionHeading">
          <Text color="sav" as="span">
            00
          </Text>
          D
        </Text>
        <Text textStyle="sectionHeading">:</Text>
        <Text textStyle="sectionHeading">
          <Text color="sav" as="span">
            00
          </Text>
          H
        </Text>
        <Text textStyle="sectionHeading">:</Text>
        <Text textStyle="sectionHeading">
          <Text color="sav" as="span">
            00
          </Text>
          M
        </Text>
        <Text textStyle="sectionHeading">:</Text>
        <Text textStyle="sectionHeading">
          <Text color="sav" as="span">
            00
          </Text>
          S
        </Text>
      </Flex>
      <div className="mint-avatar__line" />
      <Flex mt="20px" gap={{ base: '10px', lg: '42px' }} flexDir={{ base: 'column', lg: 'row' }}>
        <Text textStyle="text1">
          <Text as="span" color="gray.200">
            Price Now:
          </Text>{' '}
          0.000 SAV
        </Text>
        <Text textStyle="text1">
          <Text as="span" color="gray.200">
            Next Price:
          </Text>{' '}
          0.000 SAV
        </Text>
      </Flex>
      <Button as={Link} to="/" w="200px" mt={{ base: '30px', lg: '50px' }}>
        Mint now
      </Button>
      <Button variant="outlinedWhite" as={Link} to="/" mt="10px" w="200px">
        Activate
      </Button>
    </Flex>
  );
};
