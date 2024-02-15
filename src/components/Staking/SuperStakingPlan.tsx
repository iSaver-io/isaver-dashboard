import { FC, useCallback, useState } from 'react';
import { Box, Flex, Text, useBreakpoint, useDisclosure } from '@chakra-ui/react';
import { BigNumber } from 'ethers';

import { Button } from '@/components/ui/Button/Button';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useStakingSuperPlans, useStakingSuperPowers } from '@/hooks/staking/useStaking';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { getReadableAmount, makeBigNumber } from '@/utils/number';
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

  const handleClaim = useCallback(() => {
    setIsClaimLoading(true);
    claimSuperPlan.mutateAsync({ superPlanId }).finally(() => {
      setIsClaimLoading(false);
    });
  }, [claimSuperPlan, superPlanId]);

  const handleWithdraw = useCallback(() => {
    setIsWithdrawLoading(true);
    withdrawSuperPlan.mutateAsync({ superPlanId }).finally(() => {
      setIsWithdrawLoading(false);
    });
  }, [withdrawSuperPlan, superPlanId]);

  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm'].includes(bp);
  const isMd = ['md', 'xl'].includes(bp);
  const isLg = ['lg', '2xl'].includes(bp);

  const isClaimAvailable = userReward.gt(0);
  const isWithdrawAvailable = isClaimAvailable || userStakeSAVR.gt(0);

  const finalAPY = statusPowerC.isActive ? apy + extraAprPowerC : apy;

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
          height={{ md: '60px' }}
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
                  w="140px"
                >
                  Prolong
                </Button>
              ) : (
                <Text textStyle="textSansBold" mr="46px">
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
          gap={isSm ? '30px' : '15px'}
          direction={isSm ? 'row' : 'column'}
          flexGrow="1"
        >
          <Flex
            direction={isSm ? 'column' : 'row'}
            justifyContent="space-between"
            flexGrow="1"
            alignItems="center"
          >
            <Box flexBasis="30%">
              <Parameter isLg={isLg} isSm={isSm} title="Your stake">
                {getReadableAmount(userStakeSAVR)} SAVR
              </Parameter>
            </Box>

            <Box flexBasis="30%">
              <Parameter isLg={isLg} isSm={isSm} title="Your rewards">
                {getReadableAmount(userReward)} SAVR
              </Parameter>
            </Box>

            <Box flexBasis="30%">
              <Parameter isLg={isLg} isSm={isSm} title="APY" isHighlighted={statusPowerC.isActive}>
                {finalAPY}%
              </Parameter>
            </Box>
          </Flex>

          <Flex direction={isSm ? 'column' : 'row'} gap="15px">
            <Button
              size="md"
              width="100%"
              variant="outlined"
              isLoading={isWithdrawLoading}
              isDisabled={!isWithdrawAvailable}
              onClick={handleWithdraw}
            >
              Withdraw
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
            <Button
              size="md"
              width="100%"
              variant="outlined"
              isDisabled={!isActive || !statusPowerB.isActive}
              onClick={onOpen}
            >
              Deposit
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {isOpen ? (
        <StakingModal
          apr={finalAPY}
          isLoading={isDepositLoading}
          onClose={onClose}
          tokens={[TOKENS.SAVR]}
          onStake={handleDeposit}
          isPageView={isPageView}
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
}: {
  title: string;
  children: any;
  isSm: boolean;
  isLg: boolean;
  isHighlighted?: boolean;
}) => {
  return (
    <Flex
      alignItems="center"
      justifyContent={isSm ? 'flex-start' : 'center'}
      direction={isLg ? 'row' : 'column'}
      color={isHighlighted ? 'green.100' : 'white'}
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
