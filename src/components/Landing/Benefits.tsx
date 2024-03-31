import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { ReactComponent as BankIcon } from './images/b_bank.svg';
import { ReactComponent as BurnIcon } from './images/b_burn.svg';
import { ReactComponent as PeopleIcon } from './images/b_people.svg';
import { ReactComponent as ScalesIcon } from './images/b_scales.svg';

import './Landing.scss';

export const Benefits = () => {
  return (
    <Flex
      justifyContent="center"
      flexWrap="wrap"
      className="benefit"
      flexDirection="column"
      alignItems="center"
    >
      <h4 className="heading">Our benefits</h4>
      <Flex justifyContent="center" className="benefit-container">
        <Flex className="icons-card card--shadow">
          <BankIcon />
          <Text className="icons-card__heading">Stable Passive Income</Text>
          <Text className="icons-card__text">
            Grow your crypto portfolio with weekly passive staking reward from over 20
            cryptocurrencies and tokens
          </Text>
        </Flex>
        <Flex className="icons-card card--shadow">
          <ScalesIcon />
          <Text className="icons-card__heading">Pegged to USDT&nbsp;1&nbsp;:&nbsp;1</Text>
          <Text className="icons-card__text">No-Risk of Losing Value of staked tokens</Text>
        </Flex>
        <Flex className="icons-card card--shadow">
          <BurnIcon />
          <Text className="icons-card__heading">Deflationary tokenomik</Text>
          <Text className="icons-card__text">
            Make a swap on Biswap at no cost. Up to 50% of the trading fee returned in BSW tokens.
          </Text>
        </Flex>
        <Flex className="icons-card card--shadow">
          <PeopleIcon />
          <Text className="icons-card__heading">Multi-type Referral&nbsp;Program</Text>
          <Text className="icons-card__text">
            Invite your friends & earn up to 20% commission reward every time they make a swap on
            Biswap and gain crypto in Farms, Launchpools Lottery.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
