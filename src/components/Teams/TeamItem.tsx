import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import { Button } from '@/components/ui/Button/Button';
import { bigNumberToString } from '@/utils/number';
import { getLocalDateString } from '@/utils/time';

import { ReactComponent as TeamSectionIcon } from './icons/team-section.svg';
import { ReactComponent as TeamSectionFilledIcon } from './icons/team-section-filled.svg';

type TeamItemProps = {
  isSmallSize: boolean;
  subscription?: BigNumber;
  teamsFilled?: BigNumber;
  subscriptionCost: BigNumber;
  isSubscriptionEnding: boolean;
  stakingDuration: BigNumberish;
  reward: BigNumberish;
  teamSize: BigNumber;
  userHasStake: boolean;
  members?: string[];
  onSubscribe: () => Promise<void>;
};
export const TeamItem: FC<TeamItemProps> = ({
  isSmallSize,
  subscription,
  teamsFilled,
  subscriptionCost,
  isSubscriptionEnding,
  stakingDuration,
  reward,
  teamSize,
  userHasStake,
  members,
  onSubscribe,
}) => {
  const isSubscribed = useMemo(
    () => (subscription ? subscription.toNumber() > Date.now() / 1000 : false),
    [subscription]
  );

  const team = useMemo(
    () =>
      Array.from({ length: BigNumber.from(teamSize).toNumber() }).map((_, index) => ({
        member: members?.[index],
      })),
    [members, teamSize]
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = useCallback(() => {
    setIsLoading(true);
    onSubscribe().finally(() => {
      setIsLoading(false);
    });
  }, [onSubscribe, setIsLoading]);

  return (
    <Box
      width={isSmallSize ? '300px' : '420px'}
      background="rgba(38, 71, 55, 0.5)"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      padding={isSmallSize ? '30px 20px 40px' : '40px 40px 52px'}
      position="relative"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        height="50px"
        mb={isSmallSize ? '30px' : '50px'}
      >
        <Box>
          {!isSubscribed ? (
            <Button
              isLoading={isLoading}
              onClick={handleSubscribe}
              size={isSmallSize ? 'md' : 'lg'}
            >
              Activate
            </Button>
          ) : null}
          {isSubscriptionEnding ? (
            <Button
              variant="outlinedWhite"
              isLoading={isLoading}
              onClick={handleSubscribe}
              size={isSmallSize ? 'md' : 'lg'}
            >
              Prolong
            </Button>
          ) : null}
          {isSubscribed && !isSubscriptionEnding ? (
            <Text textStyle="textSansBold" fontSize="26px">
              Filling
            </Text>
          ) : null}
        </Box>
        <Box whiteSpace="nowrap">
          {isSubscribed ? (
            <Text textStyle="textSansBold">
              <>until {getLocalDateString(BigNumber.from(subscription).toNumber())}</>
            </Text>
          ) : (
            <Text textStyle="textSansBold">
              1 Team / {bigNumberToString(subscriptionCost, { precision: 0 })} SAV
            </Text>
          )}
        </Box>
      </Flex>

      <Box
        position="relative"
        height={isSmallSize ? '200px' : '300px'}
        px={isSmallSize ? '30px' : '20px'}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          <Text
            textStyle="text1"
            fontSize={isSmallSize ? '26px' : '44px'}
            lineHeight="40px"
            whiteSpace="nowrap"
          >
            {bigNumberToString(reward, { precision: 0 })}
            <Text as="span" fontSize="26px" ml="5px">
              SAV
            </Text>
          </Text>

          <Text textStyle="text1" fontSize={isSmallSize ? '26px' : '44px'} whiteSpace="nowrap">
            {stakingDuration.toString()}
            <Text as="span" fontSize="26px" ml="5px">
              days
            </Text>
          </Text>

          <Text
            color={userHasStake ? 'green.400' : 'error'}
            textStyle="textRegular"
            textTransform="uppercase"
            whiteSpace="nowrap"
          >
            {userHasStake ? 'Stake active' : 'No your stake'}
          </Text>
        </Box>

        {team.map(({ member }, index) => (
          <Box
            key={index}
            position="absolute"
            transformOrigin={isSmallSize ? '100px 83px' : '150px 125px'}
            transform={`translate(0, ${isSmallSize ? '18px' : '25px'}) rotate(${60 * index}deg) `}
            color={member ? 'green.400' : 'turquoise.200'}
            width={isSmallSize ? (member ? '55px' : '50px') : member ? '82px' : '75px'}
          >
            {member ? <TeamSectionFilledIcon /> : <TeamSectionIcon />}
          </Box>
        ))}
      </Box>

      <Text
        position="absolute"
        bottom={isSmallSize ? '30px' : '40px'}
        right={isSmallSize ? '40px' : '60px'}
        textAlign="center"
        opacity="0.3"
      >
        {teamsFilled?.toNumber() || 0} fills
      </Text>
    </Box>
  );
};
