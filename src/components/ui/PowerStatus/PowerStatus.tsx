import { Box, Flex, Link, Text } from '@chakra-ui/react';

import { Tip } from '@/components/ui/Tip/Tip';
import { AVATAR_LANDING_POWERS_INFO_URL } from '@/router';

import { ReactComponent as PowerIcon } from './power-icon.svg';

interface ITextMap {
  [index: number]: string;
}

const TIP_TEXTS: ITextMap = {
  0: 'Unlocks access to an additional 5 Levels of the iSaver Referral Program for 365 days after activation. Each additional level will earn you 1% in SAVR from your friends` earnings.',
  1: 'Unlocks access to the SAVR Staking Pool for 365 days after activation. Use this pool to maximize your income on the iSaver platform.',
  2: 'Increases the APR/APY of all Staking Pools on the iSaver platform for 365 days after activation.',
  3: 'Increases the number of iSaver Raffle Tickets minted for completing PUZZLES - mini free-to-play game on the iSaver platform.',
};

type PowerStatusProps = {
  powerId: number;
  isActive: boolean;
};
export const PowerStatus = ({ powerId, isActive }: PowerStatusProps) => {
  const letter = ['A', 'B', 'C', 'D'][powerId];
  let color = ['white', 'sav', 'green.100', 'savr'][powerId];

  if (!isActive) {
    color = 'gray';
  }

  const InfoLink = (
    <Link href={AVATAR_LANDING_POWERS_INFO_URL} color="savr" target="_blank">
      All about Powers
    </Link>
  );

  const tipText = TIP_TEXTS[powerId];

  return (
    <Flex alignItems="center">
      <Box color={color}>
        <PowerIcon />
      </Box>

      <Text ml="8px" textColor={color} textStyle="button">
        POWER {letter}
      </Text>
      <Text ml="11px" mr="10px" textColor="white" fontSize="16px" fontWeight={600}>
        {isActive ? 'active' : 'not active'}
      </Text>

      <Tip text={tipText} append={InfoLink} />
    </Flex>
  );
};