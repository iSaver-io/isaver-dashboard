import { FC, useCallback, useState } from 'react';
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import { AddSquadModal } from '@/components/AdminPanel/common/AddSquadModal';
import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { Button } from '@/components/ui/Button/Button';
import { useSquadPlans } from '@/hooks/squads/useSquads';
import { bigNumberToString } from '@/utils/number';

export const SquadsControl = () => {
  const { squadPlansRequest, updatePlanActivity, addSquadPlan } = useSquadPlans();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddSquad = useCallback(
    ({
      subscriptionCost,
      reward,
      stakingPlanId,
    }: {
      subscriptionCost: BigNumber;
      reward: BigNumber;
      stakingPlanId: number;
    }) => {
      return addSquadPlan.mutateAsync({
        subscriptionCost,
        reward,
        stakingThreshold: reward,
        squadSize: 6,
        stakingPlanId,
      });
    },
    [addSquadPlan]
  );

  return (
    <AdminSection title="Teams" isLoading={squadPlansRequest.isLoading}>
      <>
        <Button size="sm" onClick={onOpen}>
          Add Team plan
        </Button>

        <Box mt="16px" maxHeight="400px" overflowY="auto">
          {squadPlansRequest.data?.map((plan) => (
            <SquadInfo
              key={plan.squadPlanId.toNumber()}
              squadPlanId={plan.squadPlanId.toNumber()}
              reward={plan.reward}
              subscriptionCost={plan.subscriptionCost}
              stakingThreshold={plan.stakingThreshold}
              stakingPlanId={plan.stakingPlanId}
              isActive={plan.isActive}
              onActivate={() =>
                updatePlanActivity.mutateAsync({
                  planId: plan.squadPlanId.toNumber(),
                  isActive: true,
                })
              }
              onDeactivate={() =>
                updatePlanActivity.mutateAsync({
                  planId: plan.squadPlanId.toNumber(),
                  isActive: false,
                })
              }
            />
          ))}
        </Box>

        {isOpen ? <AddSquadModal onClose={onClose} onSubmit={handleAddSquad} /> : null}
      </>
    </AdminSection>
  );
};

type SquadsControlProps = {
  squadPlanId: number;
  subscriptionCost: BigNumber;
  reward: BigNumber;
  stakingThreshold: BigNumber;
  stakingPlanId: BigNumberish;
  isActive: boolean;
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
};
const SquadInfo: FC<SquadsControlProps> = ({
  squadPlanId,
  subscriptionCost,
  reward,
  stakingThreshold,
  stakingPlanId,
  isActive,
  onActivate,
  onDeactivate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = useCallback(() => {
    const action = isActive ? onDeactivate : onActivate;
    setIsLoading(true);
    action().finally(() => setIsLoading(false));
  }, [isActive, onDeactivate, onActivate, setIsLoading]);

  const Label = (props: any) => <Text opacity="0.5" {...props}></Text>;
  const Value = (props: any) => <Text {...props}></Text>;

  return (
    <Box
      textStyle="text1"
      _notFirst={{ mt: '16px' }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="sm"
      padding="8px"
    >
      <Flex alignItems="center" mb="8px">
        <Text mr="12px">Team (id: {squadPlanId})</Text>
        <Text color={isActive ? 'green.400' : 'red'}>{isActive ? 'Active' : 'Disabled'}</Text>

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

      <Flex alignItems="center">
        <Flex>
          <Label width="160px">Subscription cost:</Label>
          <Value width="100px">{bigNumberToString(subscriptionCost, { precision: 0 })} SAV</Value>
        </Flex>

        <Flex>
          <Label width="100px">Staking ID:</Label>
          <Value width="40px">{stakingPlanId.toString()}</Value>
        </Flex>

        <Flex>
          <Label width="110px">Min deposit:</Label>
          <Value width="120px">{bigNumberToString(stakingThreshold, { precision: 0 })} SAV</Value>
        </Flex>

        <Flex>
          <Label width="75px">Reward:</Label>
          <Value>{bigNumberToString(reward, { precision: 0 })} SAVR</Value>
        </Flex>
      </Flex>
    </Box>
  );
};
