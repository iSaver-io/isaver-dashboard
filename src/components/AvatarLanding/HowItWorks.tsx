import { Link } from 'react-router-dom';
import { Button, Flex, Grid, Text } from '@chakra-ui/react';

export const HowItWorks = () => {
  return (
    <Flex flexDirection="column" alignItems="center" paddingX={{ sm: '20px', xl: '40px' }}>
      <Text textStyle="h2" as="h2" textTransform="uppercase">
        How it works?
      </Text>
      <Grid
        justifyContent="center"
        templateColumns={{ base: 'repeat(1, 1fr)', xl: 'repeat(2, 1fr)' }}
        templateRows="repeat(2, 1fr)"
        gap="50px"
        mt="50px"
      >
        <div className="how-it-works__item">
          <Text textStyle="textBold" textTransform="uppercase">
            Ставим реальную картинку правильной формы главного героя?
          </Text>
          <Text className="how-it-works__description" textStyle="textSansSmall">
            Ставим реальную картинку правильной формы главного героя с полным наполнение слоёв.
            Ставим реальную картинку правильной формы главного героя с полным наполнение слоёвСтавим
            реальную картинку правильной формы главного героя с полным наполнение слоёв
          </Text>
        </div>
        <div className="how-it-works__item">
          <Text textStyle="textBold" textTransform="uppercase">
            Ставим реальную картинку правильной формы главного героя?
          </Text>
          <Text className="how-it-works__description" textStyle="textSansSmall">
            Ставим реальную картинку правильной формы главного героя с полным наполнение слоёв.
            Ставим реальную картинку правильной формы главного героя с полным наполнение слоёвСтавим
            реальную картинку правильной формы главного героя с полным наполнение слоёв
          </Text>
        </div>
        <div className="how-it-works__item">
          <Text textStyle="textBold" textTransform="uppercase">
            Ставим реальную картинку правильной формы главного героя?
          </Text>
          <Text className="how-it-works__description" textStyle="textSansSmall">
            Ставим реальную картинку правильной формы главного героя с полным наполнение слоёв.
            Ставим реальную картинку правильной формы главного героя с полным наполнение слоёвСтавим
            реальную картинку правильной формы главного героя с полным наполнение слоёв
          </Text>
        </div>
        <div className="how-it-works__item">
          <Text textStyle="textBold" textTransform="uppercase">
            Ставим реальную картинку правильной формы главного героя?
          </Text>
          <Text className="how-it-works__description" textStyle="textSansSmall">
            Ставим реальную картинку правильной формы главного героя с полным наполнение слоёв.
            Ставим реальную картинку правильной формы главного героя с полным наполнение слоёвСтавим
            реальную картинку правильной формы главного героя с полным наполнение слоёв
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
