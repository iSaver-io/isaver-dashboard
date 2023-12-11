import { Link } from 'react-router-dom';
import { Button, Flex, Grid, Text } from '@chakra-ui/react';

export const HowItWorks = () => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      paddingX={{ sm: '20px', lg: '30px', xl: '40px' }}
    >
      <Text textStyle="h2" as="h2" textTransform="uppercase" fontSize={{ sm: '26px', lg: '38px' }}>
        How it works?
      </Text>
      <Grid
        justifyContent="center"
        templateColumns={{ xl: 'repeat(2, 1fr)' }}
        templateRows={{ xl: 'repeat(2, 1fr)' }}
        flexDir={{ sm: 'column' }}
        gap={{ sm: '20px', '2xl': '50px' }}
        mt={{ sm: '20px', md: '30px', '2xl': '50px' }}
      >
        <div className="how-it-works__item">
          <Text
            textStyle="textBold"
            textTransform="uppercase"
            fontSize={{ sm: '14px', lg: '18px' }}
          >
            How can I activate my Avatar and get access to the Powers Block?
          </Text>
          <Text className="how-it-works__description" textStyle="textSansSmall">
            Any Avatar owner can activate their Avatar on the&nbsp;AVATAR&nbsp;SETTINGS page. Once
            you have activated your Avatar, you will have access to the&nbsp;Powers Block with
            4&nbsp;Powers. Using the&nbsp;Powers Block is free for iSaver Avatars, and it costs
            5&nbsp;SAV for all other NFT collections listed in the&nbsp;Whitepaper. The&nbsp;Powers
            Block will stop working and reset all activated Powers when the&nbsp;Avatar is
            deactivated.
          </Text>
        </div>
        <div className="how-it-works__item">
          <Text
            textStyle="textBold"
            textTransform="uppercase"
            fontSize={{ sm: '14px', lg: '18px' }}
          >
            How do I activate the Powers? What happens after the activation period expires?
          </Text>
          <Text className="how-it-works__description" textStyle="textSansSmall">
            Powers can be activated in the&nbsp;Powers Block. When activated, the&nbsp;Power burns
            out and the&nbsp;Avatar uses Power's effects for 365&nbsp;days or as long as
            the&nbsp;Avatar is active. 10&nbsp;days before the&nbsp;Power ends, the&nbsp;Powers
            Block will remind you to prolong the&nbsp;Power. A new Power will need to be activated
            to prolong the&nbsp;effect of the Power. And so on an unlimited number of times.
            The&nbsp;effect each Power has on the&nbsp;platform will stop once the&nbsp;Power is no
            longer active.
          </Text>
        </div>
        <div className="how-it-works__item">
          <Text
            textStyle="textBold"
            textTransform="uppercase"
            fontSize={{ sm: '14px', lg: '18px' }}
          >
            How many Avatars are there and how will the price of minting them on the platform
            change?
          </Text>
          <Text className="how-it-works__description" textStyle="textSansSmall">
            We know that a total of 12024&nbsp;Avatars have arrived on Earth: 10000&nbsp;are
            distributed for generation on our platform and 2024&nbsp;are in the&nbsp;Momento pool.
            The&nbsp;price of minting an&nbsp;Avatar on the&nbsp;platform will increase by
            5%&nbsp;every 3&nbsp;months.
          </Text>
        </div>
        <div className="how-it-works__item">
          <Text
            textStyle="textBold"
            textTransform="uppercase"
            fontSize={{ sm: '14px', lg: '18px' }}
          >
            What does the future hold for Avatars?
          </Text>
          <Text className="how-it-works__description" textStyle="textSansSmall">
            Avatars are the central character of our project. Every subsequent Episode will be
            associated with Avatars. Each Avatar owner, with active participation in
            the&nbsp;project, will be able to achieve greater results and gain a unique experience
            in the&nbsp;expansion of De-FI on Earth.
          </Text>
        </div>
      </Grid>
      {/* Отображаем кнопку только если больше 4 блоков */}
      {/* <Button variant="link" as={Link} to="/" mt="30px">
        See more
      </Button> */}
    </Flex>
  );
};
