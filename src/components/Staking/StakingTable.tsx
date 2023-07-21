import { useCallback, useMemo, useState } from 'react';
import { Box, Center, Flex, Tbody, Td, Thead, Tr, useDisclosure } from '@chakra-ui/react';

import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as SavrIcon } from '@/assets/images/savr_icon.svg';
import { Button } from '@/components/ui/Button/Button';
import { SortableTh } from '@/components/ui/Table/SortableTh';
import { Table } from '@/components/ui/Table/Table';
import { SortType, useDataSorting } from '@/hooks/useDataSorting';
import { useLogger } from '@/hooks/useLogger';
import { Stake, StakeStatusEnumType } from '@/types';
import { bigNumberToString } from '@/utils/number';
import { getLocalDateTimeString, getReadableDuration } from '@/utils/time';

const COLLAPSED_LIMIT = 6;

export const StakingTable = ({
  stakes,
  onClaim,
}: {
  stakes: Stake[];
  onClaim: (stakingPlanId: number, stakeId: number) => Promise<void>;
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const [loadingIndex, setLoadingIndex] = useState<number>();
  const logger = useLogger({
    event: 'staking',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'down',
    actionGroup: 'interactions',
  });

  const { sortedData, currentSortField, currentSortType, onSort } = useDataSorting(
    stakes,
    ['amount', 'period', 'timeStart', 'timeEnd', 'profit', 'reward', 'status'],
    { field: 'timeStart', type: 'desc' }
  );

  const visibleItems = useMemo(
    () => (isOpen ? sortedData : sortedData.slice(0, COLLAPSED_LIMIT)),
    [isOpen, sortedData]
  );

  const emptyRows = Math.max(0, COLLAPSED_LIMIT - visibleItems.length);

  const handleClaim = useCallback(
    async (stakingPlanId: number, stakeId: number, index: number) => {
      setLoadingIndex(index);
      onClaim(stakingPlanId, stakeId).finally(() => {
        setLoadingIndex(undefined);
      });
    },
    [setLoadingIndex, onClaim]
  );

  const handleSort = useCallback(
    (field: string, type: SortType) => {
      logger({ label: 'sort', content: field });
      onSort(field, type);
    },
    [onSort, logger]
  );

  const handleToggleTable = useCallback(() => {
    onToggle();
    logger({ label: isOpen ? 'less' : 'more', context: 'staking' });
  }, [onToggle, logger, isOpen]);

  return (
    <Box className="table-responsive-wrapper">
      <Table>
        <Thead>
          <Tr>
            <SortableTh
              width="200px"
              pl="50px"
              field="amount"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Deposit
            </SortableTh>
            <SortableTh
              width="90px"
              textAlign="center"
              field="period"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Period
            </SortableTh>
            <SortableTh
              width="200px"
              textAlign="center"
              field="timeStart"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Start
            </SortableTh>
            <SortableTh
              width="200px"
              textAlign="center"
              field="timeEnd"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              End
            </SortableTh>
            <SortableTh
              width="200px"
              textAlign="center"
              field="profit"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Reward
            </SortableTh>
            <SortableTh
              width="200px"
              textAlign="center"
              field="reward"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Total
            </SortableTh>
            <SortableTh
              width="150px"
              textAlign="center"
              field="status"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Status
            </SortableTh>
          </Tr>
        </Thead>
        <Tbody>
          {visibleItems.map((stake, index) => (
            <Tr key={`${stake.stakingPlanId}-${stake.stakeId}`}>
              <Td>
                <Flex alignItems="center">
                  <Box mr="4px">
                    {stake.isToken2 ? <SavrIcon height="26px" /> : <SavIcon height="26px" />}
                  </Box>
                  {bigNumberToString(stake.amount)} {stake.isToken2 ? 'SAVR' : 'SAV'}
                </Flex>
              </Td>
              <Td textAlign="center">{getReadableDuration(stake.period)}</Td>
              <Td textAlign="center">{getLocalDateTimeString(stake.timeStart)}</Td>
              <Td textAlign="center">{getLocalDateTimeString(stake.timeEnd)}</Td>
              <Td textAlign="center">{bigNumberToString(stake.profit)} SAV</Td>
              <Td textAlign="center">{bigNumberToString(stake.reward)} SAV</Td>
              <Td textAlign="center">
                {stake.status === StakeStatusEnumType.Completed ? (
                  <Button
                    size="xs"
                    variant="outlinedWhite"
                    isLoading={loadingIndex === index}
                    onClick={() => handleClaim(stake.stakingPlanId, stake.stakeId, index)}
                  >
                    Claim
                  </Button>
                ) : (
                  stake.status
                )}
              </Td>
            </Tr>
          ))}
          {Array.from({ length: emptyRows }).map((_, index) => (
            <Tr key={`empty-${index}`}>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {stakes.length > COLLAPSED_LIMIT ? (
        <Center mt="10px">
          <Button variant="link" onClick={handleToggleTable}>
            {isOpen ? 'Less' : 'More'}
          </Button>
        </Center>
      ) : null}
    </Box>
  );
};
