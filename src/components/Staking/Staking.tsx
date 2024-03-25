import { FC, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { PowerStatus } from '@/components/ui/PowerStatus/PowerStatus';
import { StatBlock } from '@/components/ui/StatBlock/StatBlock';
import { WarningTip } from '@/components/ui/WarningTip/WarningTip';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import {
  useActiveStakingPlansWithUserInfo,
  useStakingActions,
  useStakingPlans,
  useStakingPlansUserInfo,
  useStakingSuperPlans,
  useStakingSuperPowers,
} from '@/hooks/staking/useStaking';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useLocalReferrer } from '@/hooks/useLocalReferrer';
import { useLogger } from '@/hooks/useLogger';
import { bigNumberToString, getReadableAmount, makeBigNumber } from '@/utils/number';

import { StakingModal } from './StakingModal';
import { StakingPlan } from './StakingPlan';
import { SuperStakingPlan } from './SuperStakingPlan';

type StakingProps = {
  isPageView?: boolean;
};
export const Staking: FC<StakingProps> = ({ isPageView }) => {
  const { isConnected, address } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure(); // StakingModal toggle
  const [selectedPlan, setSelectedPlan] = useState<number>();
  const { getLocalReferrer } = useLocalReferrer();
  const logger = useLogger({
    category: 'elements',
    action: 'button_click',
    buttonLocation: 'mid',
    actionGroup: 'conversions',
    context: 'staking',
  });

  const { stakingPlansRequest } = useStakingPlans();
  const { statusPowerB, statusPowerC, extraAprPowerC } = useStakingSuperPowers();
  const { superStakingPlansWithUserStake } = useStakingSuperPlans();
  const { activeStakingPlansWithUserInfo } = useActiveStakingPlansWithUserInfo();
  const { hasEndingSubscription } = useStakingPlansUserInfo();
  const { subscribe, deposit, withdrawAllCompleted } = useStakingActions();

  const superStakingPlansToShow = useMemo(
    () =>
      superStakingPlansWithUserStake.filter(
        (superPlan) =>
          statusPowerB.isActive || superPlan.stake.profit.gt(0) || superPlan.stake.deposit.gt(0)
      ),
    [superStakingPlansWithUserStake, statusPowerB]
  );

  const closeModal = useCallback(() => {
    setSelectedPlan(undefined);
    onClose();
  }, [setSelectedPlan, onClose]);

  const onDeposit = useCallback(
    async (token: TOKENS, amount: number) => {
      if (isConnected && selectedPlan !== undefined) {
        const amountBN = makeBigNumber(amount);
        const localReferrer = getLocalReferrer() || '';

        await deposit.mutateAsync({
          planId: selectedPlan,
          amount: amountBN,
          isSAVRToken: token === TOKENS.SAVR,
          referrer: localReferrer !== address ? localReferrer : undefined,
        });
        closeModal();
      } else {
        connect();
      }
    },
    [deposit, connect, isConnected, selectedPlan, closeModal, getLocalReferrer, address]
  );

  const totalStakeSav = useMemo(
    () =>
      activeStakingPlansWithUserInfo.reduce(
        (acc, plan) => acc.add(plan.currentSavTokenStaked || 0),
        BigNumber.from(0)
      ),
    [activeStakingPlansWithUserInfo]
  );
  const totalStakeSavR = useMemo(() => {
    const plansStaked = activeStakingPlansWithUserInfo.reduce(
      (acc, plan) => acc.add(plan.currentSavrTokenStaked || 0),
      BigNumber.from(0)
    );
    const superPlansStaked = superStakingPlansToShow.reduce(
      (acc, superPlan) => acc.add(superPlan.stake.deposit || 0),
      BigNumber.from(0)
    );

    return plansStaked.add(superPlansStaked);
  }, [activeStakingPlansWithUserInfo, superStakingPlansToShow]);

  const logAction = useCallback(
    (
      planId: number,
      {
        label,
        valueKey,
      }: {
        label: 'activate' | 'deposit' | 'claim' | 'prolong';
        valueKey?: 'totalAvailableReward' | 'subscriptionCost';
      }
    ) => {
      const plan = activeStakingPlansWithUserInfo.find((plan) => plan.stakingPlanId === planId);

      const value = valueKey
        ? plan?.[valueKey]
          ? bigNumberToString(plan?.[valueKey] as BigNumber)
          : '-'
        : undefined;

      logger({
        event: isPageView ? 'staking' : 'dashboard',
        label,
        value,
        content: plan?.stakingDuration ? plan?.stakingDuration.toString() : '-',
        buttonLocation: 'mid',
        actionGroup: 'conversions',
      });
    },
    [activeStakingPlansWithUserInfo, logger, isPageView]
  );

  const handleSubscribe = useCallback(
    (planId: number, isProlong?: boolean) => {
      logAction(planId, {
        label: isProlong ? 'prolong' : 'activate',
        valueKey: 'subscriptionCost',
      });

      return subscribe.mutateAsync(planId);
    },
    [subscribe, logAction]
  );

  const handleDeposit = useCallback(
    (planId: number) => {
      logAction(planId, {
        label: 'deposit',
      });

      setSelectedPlan(planId);
      onOpen();
    },
    [logAction, setSelectedPlan, onOpen]
  );

  const handleClaim = useCallback(
    (planId: number) => {
      logAction(planId, {
        label: 'claim',
        valueKey: 'totalAvailableReward',
      });

      return withdrawAllCompleted.mutateAsync(planId);
    },
    [logAction, withdrawAllCompleted]
  );

  return (
    <Container variant="dashboard" paddingX={{ sm: '10px', md: 'unset' }}>
      <Flex
        direction={{ sm: 'column', xl: 'row' }}
        justifyContent="space-between"
        gap={5}
        paddingX={{ md: '10px', lg: 'unset' }}
      >
        <Box width={{ sm: '100%', xl: '55%' }}>
          <Text textStyle="sectionHeading" mb="20px">
            Earn by staking
          </Text>

          <Flex
            mb="20px"
            flexWrap="wrap"
            flexDirection={{ sm: 'column', md: 'row' }}
            gap={{ sm: '20px', xl: '40px' }}
          >
            <PowerStatus powerId={1} isActive={statusPowerB.isActive} />
            <PowerStatus powerId={2} isActive={statusPowerC.isActive} />
          </Flex>

          <Text textStyle="text1">
            Stake your SAV or SAVR holdings to earn more SAV. The longer you stake, the more you
            yield. Accumulate more SAV, so you can increase your governance in the future iSaver
            DAO.
          </Text>
        </Box>

        <Flex
          gap={5}
          alignSelf={{ sm: 'stretch', xl: 'flex-start' }}
          alignItems={{ sm: 'flex-start', xl: 'center' }}
          direction={{ sm: 'column', xl: 'row' }}
        >
          {hasEndingSubscription ? <WarningTip>Check your subscription!</WarningTip> : null}

          {!isPageView ? (
            isConnected ? (
              <Button
                as={Link}
                to="/staking"
                onClick={() => logger({ event: 'dashboard', label: 'my_stake' })}
                width={{ sm: '100%', lg: '50%', xl: 'unset' }}
              >
                My stake
              </Button>
            ) : (
              <ConnectWalletButton location="up" />
            )
          ) : null}
        </Flex>
      </Flex>

      {isPageView ? (
        <Flex justifyContent={{ lg: 'flex-start', xl: 'flex-end' }} mt="30px">
          <StatBlock
            leftWidth="260px"
            leftTitle="Total in Staking"
            leftValue={getReadableAmount(totalStakeSav)}
            leftCurrency="SAV"
            rightWidth="260px"
            rightTitle="Total in Staking"
            rightValue={getReadableAmount(totalStakeSavR)}
            rightCurrency="SAVR"
          />
        </Flex>
      ) : null}

      <Grid
        mt={isPageView ? '50px' : '40px'}
        gap={5}
        templateRows="repeat(2, 1fr)"
        templateColumns={{ lg: 'repeat(1, 1fr)', xl: 'repeat(2, 1fr)' }}
      >
        {!activeStakingPlansWithUserInfo.length
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                height="210px"
                borderRadius="md"
                startColor="gray.200"
                endColor="bgGreen.200"
              />
            ))
          : null}
        {activeStakingPlansWithUserInfo.map((planData) => (
          <GridItem
            colSpan={1}
            rowSpan={1}
            key={planData.stakingPlanId}
            width={{ sm: '300px', md: '100%' }}
          >
            <StakingPlan
              isActive={planData.isActive}
              isSubscribed={planData.isSubscribed}
              isSubscriptionEnding={planData.isSubscriptionEnding}
              isSuperPowered={planData.isSuperPowered}
              subscribedTill={planData.subscribedTill}
              subscriptionCost={planData.subscriptionCost}
              subscriptionDuration={planData.subscriptionDuration}
              stakingDuration={planData.stakingDuration}
              poolSize={planData.currentSavTokenLocked.add(planData.currentSavrTokenLocked)}
              apr={planData.apr}
              userStakeSav={planData.currentSavTokenStaked || 0}
              userStakeSavR={planData.currentSavrTokenStaked || 0}
              userTotalReward={planData.totalReward}
              isClaimAvailable={planData.hasReadyStakes}
              onSubscribe={() =>
                handleSubscribe(planData.stakingPlanId, planData.isSubscriptionEnding)
              }
              onDeposit={() => handleDeposit(planData.stakingPlanId)}
              onClaim={() => handleClaim(planData.stakingPlanId)}
            />
          </GridItem>
        ))}

        {superStakingPlansToShow.map((superPlan) => (
          <GridItem
            colSpan={1}
            rowSpan={1}
            key={superPlan.stakingPlanId}
            width={{ sm: '300px', md: '100%' }}
          >
            <SuperStakingPlan
              superPlanId={superPlan.stakingPlanId}
              isActive={superPlan.plan.isActive}
              apy={superPlan.apr.apr}
              userStakeSAVR={superPlan.stake.deposit}
              userReward={superPlan.stake.profit}
              isPageView={isPageView}
            />
          </GridItem>
        ))}
      </Grid>
      {isOpen && selectedPlan !== undefined ? (
        <StakingModal
          apr={
            (stakingPlansRequest.data?.[selectedPlan].apr || 0) +
            (statusPowerC.isActive ? extraAprPowerC : 0)
          }
          lockPeriodDays={stakingPlansRequest.data?.[selectedPlan].stakingDuration || 0}
          isLoading={deposit.isLoading}
          isPageView={isPageView}
          highlightApr={statusPowerC.isActive}
          onClose={closeModal}
          onStake={onDeposit}
        />
      ) : null}
    </Container>
  );
};
