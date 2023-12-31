import { FC, useCallback, useState } from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import { Button } from '@/components/ui/Button/Button';
import { bigNumberToString, getReadableAmount, getYearlyAPR } from '@/utils/number';
import { getLocalDateString, getReadableDuration } from '@/utils/time';

type StakingPlanProps = {
  isActive: boolean;
  isSubscribed?: boolean;
  isSubscriptionEnding?: boolean;
  subscribedTill?: BigNumberish;
  subscriptionCost: BigNumberish;
  subscriptionDuration: BigNumberish;
  stakingDuration: BigNumberish;
  poolSize: BigNumberish;
  apr: number | string;
  userStakeSav: BigNumberish;
  userStakeSavR: BigNumberish;
  userTotalReward?: BigNumber;
  isClaimAvailable?: boolean;

  onSubscribe: () => Promise<void>;
  onDeposit: () => void;
  onClaim: () => Promise<void>;
};
export const StakingPlan: FC<StakingPlanProps> = ({
  isActive,
  isSubscribed,
  isSubscriptionEnding,
  subscribedTill,
  subscriptionCost,
  subscriptionDuration,
  stakingDuration,
  poolSize,
  apr,
  userStakeSav,
  userStakeSavR,
  userTotalReward,
  isClaimAvailable,
  onSubscribe,
  onDeposit,
  onClaim,
}) => {
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const handleSubscribe = useCallback(() => {
    setIsSubscribeLoading(true);
    onSubscribe().finally(() => {
      setIsSubscribeLoading(false);
    });
  }, [setIsSubscribeLoading, onSubscribe]);

  const handleClaim = useCallback(() => {
    setIsClaimLoading(true);
    onClaim().finally(() => {
      setIsClaimLoading(false);
    });
  }, [setIsClaimLoading, onClaim]);

  const bp = useBreakpoint({ ssr: false });
  const isSm = bp === 'sm';

  return (
    <Box borderRadius="md" overflow="hidden" boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)">
      <Flex
        bgColor={!isActive ? 'rgba(201, 91, 91, 0.5)' : isSubscribed ? 'green.10050' : 'gray.200'}
        p="10px 20px"
        justifyContent="flex-end"
        height={{ md: '60px' }}
        alignItems="center"
        whiteSpace="nowrap"
      >
        <Flex direction={{ sm: 'column', md: 'row' }} alignItems="center">
          {isSubscriptionEnding ? (
            <Text textStyle="textSansBold" mr={{ md: 5 }}>
              <>
                Until <span>{getLocalDateString(BigNumber.from(subscribedTill).toNumber())}</span>
              </>
            </Text>
          ) : null}

          {!isSubscribed || isSubscriptionEnding ? (
            <Text textStyle="textSansBold">
              {bigNumberToString(subscriptionCost, { precision: 0 })} SAV /{' '}
              {getReadableDuration(subscriptionDuration)}
            </Text>
          ) : null}
        </Flex>

        {isActive ? (
          <>
            {isSubscriptionEnding ? (
              <Button
                variant="outlinedWhite"
                onClick={handleSubscribe}
                isLoading={isSubscribeLoading}
                size="md"
                ml={5}
                w="140px"
              >
                Prolong
              </Button>
            ) : null}

            {!isSubscribed ? (
              <Button onClick={handleSubscribe} isLoading={isSubscribeLoading} size="md" ml={5}>
                Activate
              </Button>
            ) : null}

            {isSubscribed && !isSubscriptionEnding ? (
              <Text textStyle="textSansBold" mr="46px">
                Active
              </Text>
            ) : null}
          </>
        ) : (
          <Text textStyle="textSansBold" mr="30px">
            Stopped
          </Text>
        )}
      </Flex>

      <Box bgColor="rgba(38, 71, 55, 0.5)" boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)" p="20px">
        <Flex
          alignItems="center"
          gap={5}
          direction={{ sm: 'column', lg: 'row', xl: 'column', '2xl': 'row' }}
        >
          <Box width="100%">
            <Flex
              justifyContent="space-between"
              gap={2}
              mb={{ sm: '16px', md: '24px' }}
              direction={{ sm: 'column', md: 'row' }}
            >
              <Flex justifyContent="space-between" mb={{ sm: '16px', md: 'unset' }}>
                <StakingParameter title="Locking period">
                  {getReadableDuration(stakingDuration)}
                </StakingParameter>

                {isSm ? (
                  <StakingParameter title="APR">{getYearlyAPR(apr)}%</StakingParameter>
                ) : null}
              </Flex>
              <StakingParameter title="Pool size">{getReadableAmount(poolSize)}</StakingParameter>
              {isSm ? null : <StakingParameter title="APR">{getYearlyAPR(apr)}%</StakingParameter>}
            </Flex>
            <Flex justifyContent="space-between" direction={{ sm: 'column', md: 'row' }}>
              <Box mb={{ sm: '16px', md: 'unset' }}>
                <StakingParameter title="Your Stake">
                  <Flex flexWrap="wrap">
                    <Box as="span" ml={2} mr={2}>
                      <span>{getReadableAmount(userStakeSav, { shortify: true })}</span> SAV
                    </Box>
                    <Box as="span" mr={2} ml={2}>
                      <span>{getReadableAmount(userStakeSavR, { shortify: true })}</span> SAVR
                    </Box>
                  </Flex>
                </StakingParameter>
              </Box>
              <StakingParameter title="Your rewards">
                <span>{bigNumberToString(userTotalReward || 0)}</span> SAV
              </StakingParameter>
            </Flex>
          </Box>

          <Flex
            direction={{ sm: 'row', lg: 'column', xl: 'row', '2xl': 'column' }}
            width={{ sm: '100%', lg: 'unset', xl: '100%', '2xl': 'unset' }}
            flex={{ '2xl': '0 0 140px' }}
            gap="15px"
          >
            <Button
              size="md"
              width="100%"
              variant="outlined"
              isDisabled={!isSubscribed || !isActive}
              onClick={onDeposit}
            >
              Deposit
            </Button>
            <Button
              size="md"
              width="100%"
              variant="outlined"
              isLoading={isClaimLoading}
              isDisabled={!isClaimAvailable || isClaimLoading}
              onClick={handleClaim}
            >
              Claim
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

const StakingParameter = ({ title, children }: { title: string; children: any }) => {
  return (
    <Flex alignItems="center">
      <Box textStyle="textSansSmall" mr="10px" whiteSpace="nowrap">{`${title}`}</Box>
      <Box textStyle="textSansBold" whiteSpace="nowrap">
        {children}
      </Box>
    </Flex>
  );
};
