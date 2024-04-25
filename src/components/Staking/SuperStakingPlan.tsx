import { FC, useCallback, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { Box, Flex, Text, useBreakpoint, useDisclosure } from '@chakra-ui/react';
import { BigNumber } from 'ethers';

import { Button } from '@/components/ui/Button/Button';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useStakingSuperPlans, useStakingSuperPowers } from '@/hooks/staking/useStaking';
import { useLogger } from '@/hooks/useLogger';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { bigNumberToNumber, getReadableAmount, makeBigNumber } from '@/utils/number';
import { getLocalDateString } from '@/utils/time';

import { StakingModal } from './StakingModal';

type SuperStakingPlanProps = {
  isActive: boolean;
  superPlanId: number;
  apy: number;
  userStakeSAVR: BigNumber;
  userReward: BigNumber;
  isPageView?: boolean;
};
export const SuperStakingPlan: FC<SuperStakingPlanProps> = ({
  isActive,
  superPlanId,
  apy,
  userStakeSAVR,
  userReward,
  isPageView,
}) => {
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // StakingModal toggle
  const navigate = useNavigateByHash();
  const logger = useLogger({
    event: isPageView ? 'staking' : 'dashboard',
    category: 'elements',
    action: 'button_click',
    content: 'Power B',
    context: 'staking',
    buttonLocation: 'mid',
    actionGroup: 'conversions',
  });

  const { statusPowerB, statusPowerC, extraAprPowerC } = useStakingSuperPowers();
  const { depositSuperPlan, claimSuperPlan, withdrawSuperPlan } = useStakingSuperPlans();

  const handleSubscribe = useCallback(() => {
    navigate('/avatar-settings#powers');
  }, [navigate]);

  const handleDeposit = useCallback(
    (_: any, amount: number) => {
      const amountBN = makeBigNumber(amount);
      setIsDepositLoading(true);
      depositSuperPlan
        .mutateAsync({ superPlanId, amount: amountBN })
        .then(() => onClose())
        .finally(() => {
          setIsDepositLoading(false);
        });
    },
    [depositSuperPlan, superPlanId, onClose]
  );

  const handleDepositModalOpen = useCallback(() => {
    logger({ label: 'deposit' });
    onOpen();
  }, [logger, onOpen]);

  const handleClaim = useCallback(() => {
    logger({
      label: 'claim',
      value: userReward.toString(),
    });

    setIsClaimLoading(true);
    claimSuperPlan.mutateAsync({ superPlanId }).finally(() => {
      setIsClaimLoading(false);
    });
  }, [claimSuperPlan, superPlanId, userReward, logger]);

  const handleWithdraw = useCallback(() => {
    logger({
      label: 'withdraw',
      value: userStakeSAVR.add(userReward).toString(),
    });

    setIsWithdrawLoading(true);
    withdrawSuperPlan.mutateAsync({ superPlanId }).finally(() => {
      setIsWithdrawLoading(false);
    });
  }, [withdrawSuperPlan, superPlanId, userReward, userStakeSAVR, logger]);

  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm'].includes(bp);
  const isLg = ['lg', '2xl'].includes(bp);
  const buttonWidth = ['2xl'].includes(bp) ? '140px' : '120px';
  const buttonShadow = '0px 9px 18px rgba(107, 201, 91, 0.27)';

  const isClaimAvailable = userReward.gt(0);
  const isWithdrawAvailable = isClaimAvailable || userStakeSAVR.gt(0);

  const finalAPY = statusPowerC.isActive ? apy + extraAprPowerC : apy;

  const [initialRewardValue, setInitialRewardValue] = useState<number>();

  useEffect(() => {
    if (!initialRewardValue) {
      setInitialRewardValue(bigNumberToNumber(userReward, { precision: 6 }) * 0.95); // set initialValue less on 5% to real value, to start counter on mount
    }
  }, [userReward, initialRewardValue]);

  return (
    <>
      <Flex
        borderRadius="md"
        overflow="hidden"
        boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
        height="100%"
        direction="column"
      >
        <Flex
          bgColor={statusPowerB.isActive ? 'rgba(165, 237, 93, 0.5)' : 'gray.200'}
          p="10px 20px"
          justifyContent="flex-end"
          height="60px"
          alignItems="center"
          whiteSpace="nowrap"
        >
          {statusPowerB.isEnding ? (
            <Text textStyle="textSansBold" mr={{ md: 5 }}>
              <>
                Until{' '}
                <span>{getLocalDateString(BigNumber.from(statusPowerB.power).toNumber())}</span>
              </>
            </Text>
          ) : null}

          {isActive ? (
            <>
              {statusPowerB.isEnding || !statusPowerB.isActive ? (
                <Button
                  variant="outlinedWhite"
                  onClick={handleSubscribe}
                  size="md"
                  ml={5}
                  borderRadius="md"
                  w={buttonWidth}
                >
                  Prolong
                </Button>
              ) : (
                <Text textStyle="textSansBold" mr={{ sm: '10px', '2xl': '46px' }}>
                  Active
                </Text>
              )}
            </>
          ) : (
            <Text textStyle="textSansBold" mr="30px">
              Stopped
            </Text>
          )}
        </Flex>

        <Flex
          padding={isLg ? '30px 20px' : '20px'}
          gap={isSm ? '25px' : '15px'}
          direction={isSm ? 'column' : 'row'}
          justifyContent="space-between"
          flexGrow="1"
        >
          <Flex
            direction={isSm ? 'row' : 'column'}
            justifyContent={isSm ? 'space-between' : 'center'}
            gap={isSm ? '5px' : '15px'}
            alignItems="center"
          >
            <Parameter isLg={isLg} isSm={isSm} title="Your stake">
              {getReadableAmount(userStakeSAVR)} SAVR
            </Parameter>

            <Button
              size="md"
              borderRadius="md"
              w={buttonWidth}
              boxShadow={buttonShadow}
              variant="outlined"
              isLoading={isWithdrawLoading}
              isDisabled={!isWithdrawAvailable}
              onClick={handleWithdraw}
            >
              Withdraw
            </Button>
          </Flex>

          <Flex
            direction={isSm ? 'row' : 'column'}
            justifyContent={isSm ? 'space-between' : 'center'}
            gap={isSm ? '5px' : '15px'}
            alignItems="center"
          >
            <Parameter isLg={isLg} isSm={isSm} title="Your rewards">
              <CountUp
                duration={20}
                start={initialRewardValue}
                end={bigNumberToNumber(userReward, { precision: 6 })}
                decimals={6}
                preserveValue={true}
                useEasing={false}
              />{' '}
              SAVR
            </Parameter>
            <Button
              size="md"
              borderRadius="md"
              w={buttonWidth}
              boxShadow={buttonShadow}
              variant="outlined"
              isLoading={isClaimLoading}
              isDisabled={!isClaimAvailable || isClaimLoading}
              onClick={handleClaim}
            >
              Claim
            </Button>
          </Flex>

          <Flex
            direction={isSm ? 'row' : 'column'}
            justifyContent={isSm ? 'space-between' : 'center'}
            gap={isSm ? '5px' : '15px'}
            alignItems="center"
          >
            <Parameter isLg={isLg} isSm={isSm} title="APY" isHighlighted={statusPowerC.isActive}>
              {finalAPY}%
            </Parameter>

            <Button
              size="md"
              borderRadius="md"
              w={buttonWidth}
              boxShadow={buttonShadow}
              variant="outlined"
              isDisabled={!isActive || !statusPowerB.isActive}
              onClick={handleDepositModalOpen}
            >
              Deposit
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {isOpen ? (
        <StakingModal
          apr={finalAPY}
          tokens={[TOKENS.SAVR]}
          isLoading={isDepositLoading}
          highlightApr={statusPowerC.isActive}
          isPageView={isPageView}
          onClose={onClose}
          onStake={handleDeposit}
        />
      ) : null}
    </>
  );
};

const Parameter = ({
  title,
  children,
  isHighlighted,
  isSm,
  isLg,
  justifyContent,
}: {
  title: string;
  children: any;
  isSm: boolean;
  isLg: boolean;
  isHighlighted?: boolean;
  justifyContent?: any;
}) => {
  return (
    <Flex
      alignItems={isSm ? 'flex-start' : 'center'}
      justifyContent={justifyContent || isSm ? 'flex-start' : 'center'}
      direction={isLg ? 'row' : 'column'}
      color={isHighlighted ? 'green.100' : 'white'}
      flexGrow={1}
    >
      <Box textStyle="textSansExtraSmall" mr="10px" whiteSpace="nowrap">
        {title}
      </Box>
      <Box textStyle="textSansBold" whiteSpace="nowrap">
        {children}
      </Box>
    </Flex>
  );
};
