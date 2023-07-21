import { FC, useCallback, useMemo } from 'react';
import { Box, Center, Tbody, Td, Thead, Tr, useDisclosure } from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';
import { SortableTh } from '@/components/ui/Table/SortableTh';
import { Table } from '@/components/ui/Table/Table';
import { SortType, useDataSorting } from '@/hooks/useDataSorting';
import { useLogger } from '@/hooks/useLogger';
import { ReferralReward } from '@/types';
import { bigNumberToString } from '@/utils/number';
import { getLocalDateTimeString, getReadableDuration } from '@/utils/time';

const COLLAPSED_LIMIT = 6;

type RewardsTableProps = {
  rewards: ReferralReward[];
};
export const ReferralRewardsTable: FC<RewardsTableProps> = ({ rewards }) => {
  const { isOpen, onToggle } = useDisclosure();
  const logger = useLogger({
    event: 'team',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'down',
    actionGroup: 'interactions',
  });

  const { sortedData, currentSortField, currentSortType, onSort } = useDataSorting(
    rewards,
    [
      'referral',
      'level',
      'depositAmount',
      'rewardAmount',
      'depositDate',
      'stakingDuration',
      'reason',
    ],
    {
      field: 'depositDate',
      type: 'desc',
    }
  );

  const handleSort = useCallback(
    (field: string, type: SortType) => {
      onSort(field, type);
      logger({ label: 'sort', content: field });
    },
    [onSort, logger]
  );

  const visibleItems = useMemo(
    () => (isOpen ? sortedData : sortedData.slice(0, COLLAPSED_LIMIT)),
    [isOpen, sortedData]
  );

  const emptyRows = Math.max(0, COLLAPSED_LIMIT - visibleItems.length);

  const handleToggleTable = useCallback(() => {
    onToggle();
    logger({ label: isOpen ? 'less' : 'more', context: 'teams' });
  }, [onToggle, logger, isOpen]);

  return (
    <Box className="table-responsive-wrapper">
      <Table>
        <Thead>
          <Tr>
            <SortableTh
              textAlign="center"
              width="360px"
              field="referral"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Wallet
            </SortableTh>
            <SortableTh
              textAlign="center"
              width="100px"
              field="depositDate"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Date
            </SortableTh>
            <SortableTh
              textAlign="center"
              width="150px"
              field="depositAmount"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Deposit
            </SortableTh>
            <SortableTh
              textAlign="center"
              width="90px"
              field="stakingDuration"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Period
            </SortableTh>
            <SortableTh
              textAlign="center"
              width="90px"
              field="level"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Level
            </SortableTh>
            <SortableTh
              textAlign="center"
              width="200px"
              field="rewardAmount"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Reward
            </SortableTh>
            <SortableTh
              textAlign="center"
              width="100px"
              field="reason"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Comment
            </SortableTh>
          </Tr>
        </Thead>
        <Tbody>
          {visibleItems.map((reward) => (
            <Tr key={reward.depositDate}>
              <Td textAlign="center">{reward.referral}</Td>
              <Td textAlign="center">{getLocalDateTimeString(reward.depositDate)}</Td>
              <Td textAlign="center">{bigNumberToString(reward.depositAmount)} SAV</Td>
              <Td textAlign="center">{getReadableDuration(reward.stakingDuration)}</Td>
              <Td textAlign="center">{reward.level}</Td>
              <Td textAlign="center">{bigNumberToString(reward.rewardAmount)} SAVR</Td>
              <Td textAlign="center">{reward.reason}</Td>
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

      {rewards.length > COLLAPSED_LIMIT ? (
        <Center mt="10px">
          <Button variant="link" onClick={handleToggleTable}>
            {isOpen ? 'Less' : 'More'}
          </Button>
        </Center>
      ) : null}
    </Box>
  );
};
