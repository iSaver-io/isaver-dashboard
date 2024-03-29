import { FC, useCallback, useState } from 'react';
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import {
  AddStakingModal,
  AddSuperStakingModal,
} from '@/components/AdminPanel/common/AddStakingModal';
import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { Button } from '@/components/ui/Button/Button';
import {
  useStakingAdminActions,
  useStakingPlans,
  useStakingSuperPlans,
  useStakingSuperPowers,
} from '@/hooks/staking/useStaking';
import { useStakingHistory } from '@/hooks/staking/useStakingHistory';
import { bigNumberToString } from '@/utils/number';
import { getReadableDuration } from '@/utils/time';

import { ControlField } from '../common/ControlField';

export const StakingControl = () => {
  const { stakingPlansRequest } = useStakingPlans();
  const {
    addStakingPlan,
    updatePlanActivity,
    updateExtraAprPowerC,
    addSuperStakingPlan,
    updateSuperPlanActivity,
  } = useStakingAdminActions();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSuperModalOpen,
    onOpen: onSuperModalOpen,
    onClose: onSuperModalClose,
  } = useDisclosure();
  const { extraAprPowerC } = useStakingSuperPowers();
  const { superStakingPlansWithUserStake } = useStakingSuperPlans();

  const { claimsCountData } = useStakingHistory();

  return (
    <AdminSection title="Staking" isLoading={stakingPlansRequest.isLoading}>
      <>
        <ControlField
          label="Extra APR for Power C"
          value={extraAprPowerC * 10 || 0}
          onSubmit={updateExtraAprPowerC.mutateAsync}
        />

        <Button size="sm" onClick={onOpen}>
          Add staking plan
        </Button>

        <Box mt="16px" maxHeight="400px" overflowY="auto">
          {stakingPlansRequest.data?.map((plan) => (
            <StakingPlanInfo
              key={plan.stakingPlanId}
              stakingPlanId={plan.stakingPlanId}
              duration={plan.stakingDuration}
              subscriptionCost={plan.subscriptionCost}
              apr={plan.apr.toString()}
              isActive={plan.isActive}
              totalStakesSav={plan.totalStakesSavTokenNo.toNumber()}
              totalStakesSavr={plan.totalStakesSavrTokenNo.toNumber()}
              claimedStakesSav={claimsCountData?.[plan.stakingPlanId]?.sav || 0}
              claimedStakesSavr={claimsCountData?.[plan.stakingPlanId]?.savr || 0}
              isSuperPowered={plan.isSuperPowered}
              onActivate={() =>
                updatePlanActivity.mutateAsync({
                  planId: plan.stakingPlanId,
                  isActive: true,
                })
              }
              onDeactivate={() =>
                updatePlanActivity.mutateAsync({
                  planId: plan.stakingPlanId,
                  isActive: false,
                })
              }
            />
          ))}
        </Box>

        <Text mt="32px" textStyle="textMedium">
          Special plans Power B:
        </Text>

        <Button size="sm" mt="12px" onClick={onSuperModalOpen}>
          Add super staking plan
        </Button>

        <Box mt="16px" maxHeight="400px" overflowY="auto">
          {superStakingPlansWithUserStake.map((superPlan) => (
            <SuperStakingPlanInfo
              stakingPlanId={superPlan.stakingPlanId}
              apr={superPlan.apr.apr}
              isActive={superPlan.plan.isActive}
              totalStaked={superPlan.plan.totalStaked}
              totalClaimed={superPlan.plan.totalClaimed}
              currentLocked={superPlan.plan.currentLocked}
              onActivate={() =>
                updateSuperPlanActivity.mutateAsync({
                  superPlanId: superPlan.stakingPlanId,
                  isActive: true,
                })
              }
              onDeactivate={() =>
                updateSuperPlanActivity.mutateAsync({
                  superPlanId: superPlan.stakingPlanId,
                  isActive: false,
                })
              }
            />
          ))}
        </Box>

        {isOpen ? (
          <AddStakingModal onClose={onClose} onSubmit={addStakingPlan.mutateAsync} />
        ) : null}

        {isSuperModalOpen ? (
          <AddSuperStakingModal
            onClose={onSuperModalClose}
            onSubmit={addSuperStakingPlan.mutateAsync}
          />
        ) : null}
      </>
    </AdminSection>
  );
};

const Label = (props: any) => <Text opacity="0.5" {...props}></Text>;
const Value = (props: any) => <Text {...props}></Text>;

type StakingPlanInfoProps = {
  stakingPlanId: number;
  duration: BigNumberish;
  subscriptionCost: BigNumber;
  apr: string | number;
  isActive: boolean;
  isSuperPowered: boolean;
  totalStakesSav: number;
  totalStakesSavr: number;
  claimedStakesSav: number;
  claimedStakesSavr: number;
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
};
const StakingPlanInfo: FC<StakingPlanInfoProps> = ({
  stakingPlanId,
  duration,
  subscriptionCost,
  apr,
  isActive,
  isSuperPowered,
  totalStakesSav,
  totalStakesSavr,
  claimedStakesSav,
  claimedStakesSavr,
  onActivate,
  onDeactivate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = useCallback(() => {
    const action = isActive ? onDeactivate : onActivate;
    setIsLoading(true);
    action().finally(() => setIsLoading(false));
  }, [isActive, onDeactivate, onActivate, setIsLoading]);

  return (
    <Box
      textStyle="text1"
      fontSize="16px"
      _notFirst={{ mt: '16px' }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="sm"
      padding="8px"
    >
      <Flex alignItems="center" mb="8px">
        <Text mr="12px">Staking (id: {stakingPlanId})</Text>
        <Text color={isActive ? 'green.400' : 'red'}>{isActive ? 'Active' : 'Disabled'}</Text>

        {isSuperPowered ? (
          <Text color="sav" ml="12px">
            Power B
          </Text>
        ) : null}
      </Flex>

      <Flex alignItems="center" mb="12px">
        <Flex>
          <Label width="90px">Duration:</Label>
          <Value width="100px">{getReadableDuration(duration)}</Value>
        </Flex>

        <Flex>
          <Label width="160px">Subscription cost:</Label>
          <Value width="140px">{bigNumberToString(subscriptionCost)} SAV</Value>
        </Flex>

        <Flex>
          <Label width="50px">APR:</Label>
          <Value>{apr} %</Value>
        </Flex>
      </Flex>

      <Flex mb="4px">
        <Label width="230px">Stakes SAV (active / total):</Label>
        <Value width="160px">
          {totalStakesSav - claimedStakesSav} / {totalStakesSav}
        </Value>
      </Flex>
      <Flex alignItems="center">
        <Flex>
          <Label width="230px">Stakes SAVR (active / total):</Label>
          <Value width="160px">
            {totalStakesSavr - claimedStakesSavr} / {totalStakesSavr}
          </Value>
        </Flex>

        <Button
          variant={isActive ? 'filledRed' : undefined}
          width="120px"
          ml="auto"
          size="sm"
          borderRadius="sm"
          isLoading={isLoading}
          onClick={handleAction}
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </Flex>
    </Box>
  );
};

type SuperStakingPlanInfoProps = {
  stakingPlanId: number;
  apr: string | number;
  isActive: boolean;
  totalStaked: BigNumber;
  totalClaimed: BigNumber;
  currentLocked: BigNumber;
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
};
const SuperStakingPlanInfo: FC<SuperStakingPlanInfoProps> = ({
  stakingPlanId,
  isActive,
  apr,
  totalStaked,
  currentLocked,
  totalClaimed,
  onActivate,
  onDeactivate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = useCallback(() => {
    const action = isActive ? onDeactivate : onActivate;
    setIsLoading(true);
    action().finally(() => setIsLoading(false));
  }, [isActive, onDeactivate, onActivate, setIsLoading]);

  return (
    <Box
      textStyle="text1"
      fontSize="16px"
      _notFirst={{ mt: '16px' }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="sm"
      padding="8px"
    >
      <Flex alignItems="center" mb="8px">
        <Text mr="12px">Super Staking (id: {stakingPlanId})</Text>
        <Text color={isActive ? 'green.400' : 'red'}>{isActive ? 'Active' : 'Disabled'}</Text>
      </Flex>

      <Flex alignItems="flex-end">
        <Box>
          <Flex>
            <Label width="50px">APY:</Label>
            <Value>{apr} %</Value>
          </Flex>

          <Flex>
            <Label width="120px">Total staked:</Label>
            <Value width="160px">{bigNumberToString(totalStaked)} SAVR</Value>
          </Flex>

          <Flex>
            <Label width="120px">Total claimed:</Label>
            <Value width="160px">{bigNumberToString(totalClaimed)} SAVR</Value>
          </Flex>

          <Flex>
            <Label width="140px">Current locked:</Label>
            <Value width="160px">{bigNumberToString(currentLocked)} SAVR</Value>
          </Flex>
        </Box>

        <Button
          variant={isActive ? 'filledRed' : undefined}
          width="120px"
          ml="auto"
          size="sm"
          borderRadius="sm"
          isLoading={isLoading}
          onClick={handleAction}
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </Flex>
    </Box>
  );
};
