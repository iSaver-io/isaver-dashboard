import { useCallback, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useNetwork } from 'wagmi';

import { StakeUnlockChart } from '@/components/AdminPanel/common/StakeUnlockChart';
import { Button } from '@/components/ui/Button/Button';
import { ExportButton } from '@/components/ui/ExportButton/ExportButton';
import { SortableTh } from '@/components/ui/Table/SortableTh';
import { Table } from '@/components/ui/Table/Table';
import { PERIOD, useStakingHistory, useStakingUnlocks } from '@/hooks/staking/useStakingHistory';
import { useDataSorting } from '@/hooks/useDataSorting';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatStakesUnlocksToExport } from '@/utils/formatters/formatStakesUnlocksToExport';
import { getExplorerLink } from '@/utils/getExplorerLink';
import { bigNumberToString } from '@/utils/number';
import {
  getLocalDateString,
  getLocalDateTimeString,
  getLocalTimeOffset,
  getReadableDuration,
} from '@/utils/time';

import { AdminSection } from '../common/AdminSection';

export const StakingTVL = () => {
  const [period, setPeriod] = useState<PERIOD>(PERIOD.DAY);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), null]);
  const [startDate, endDate] = dateRange;
  const { chain } = useNetwork();

  const { stakesDataRequest } = useStakingHistory();

  const stakingUnlocksData = useStakingUnlocks(period, startDate, endDate);

  const filteredStakes = useMemo(
    () =>
      (stakesDataRequest.data || [])
        .filter(
          (stake) =>
            (startDate
              ? stake.tillTimestamp >= (startDate.getTime() - getLocalTimeOffset()) / 1000
              : true) &&
            (endDate
              ? stake.tillTimestamp <= (endDate.getTime() - getLocalTimeOffset()) / 1000
              : true)
        )
        .map((stake) => ({
          ...stake,
          reward: stake.isSAVRToken ? stake.profit : stake.amount.add(stake.profit),
        })),
    [stakesDataRequest.data, startDate, endDate]
  );

  const { sortedData, currentSortField, currentSortType, onSort } = useDataSorting(
    filteredStakes,
    ['period', 'tillTimestamp', 'reward'],
    { field: 'tillTimestamp', type: 'asc' }
  );

  const exportData = useCallback(() => {
    const { data, headers } = formatStakesUnlocksToExport(sortedData);
    const fromDate = startDate
      ? Math.floor((startDate.getTime() - getLocalTimeOffset()) / 1000)
      : null;
    const toDate = endDate ? Math.floor((endDate.getTime() - getLocalTimeOffset()) / 1000) : null;

    let filename = 'isaver_unlocks';
    if (fromDate) filename += `_from_${getLocalDateString(fromDate)}`;
    if (toDate) filename += `_to_${getLocalDateString(toDate)}`;
    filename += '_created-at';

    exportToExcel(filename, data, headers);
  }, [sortedData, startDate, endDate]);

  return (
    <AdminSection title="Staking TVL" isLoading={stakesDataRequest.isLoading}>
      <Flex justifyContent="flex-end" alignItems="center">
        <Flex alignItems="center" mr="20px">
          <Text mr="8px">Group by:</Text>
          <Menu variant="dark-transparent" placement="bottom-end" size="sm">
            <MenuButton
              size="sm"
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="transparent"
              padding={0}
              fontSize={{ sm: '18px' }}
              textTransform="capitalize"
            >
              {period}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setPeriod(PERIOD.DAY)}>Day</MenuItem>
              <MenuItem onClick={() => setPeriod(PERIOD.WEEK)}>Week</MenuItem>
              <MenuItem onClick={() => setPeriod(PERIOD.MONTH)}>Month</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Flex alignItems="center">
          <Text mr="8px">Period:</Text>
          <DatePicker
            className="date-picker-element date-picker-element--wide"
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            minDate={new Date(2023, 0, 1)}
            isClearable={true}
            dateFormat="yyyy-MM-dd"
            // showMonthYearPicker={period === PERIOD.MONTH}
            // showMonthYearDropdown
            // scrollableMonthYearDropdown
            // useShortMonthInDropdown
            onChange={setDateRange}
          />
        </Flex>
      </Flex>

      <Box height="300px">
        <StakeUnlockChart data={stakingUnlocksData} period={period} />
      </Box>

      <Box>
        {stakingUnlocksData?.length ? (
          <>
            <Flex justifyContent="space-between" alignItems="center" mb={5} mt="20px">
              <Text fontSize="22px" fontWeight="600">
                Unlocked stakes ({filteredStakes?.length})
              </Text>

              <ExportButton onClick={exportData} />
            </Flex>

            <Box
              className="table-responsive-wrapper"
              position="relative"
              maxH="500px"
              overflow="auto"
            >
              <Table>
                <Thead>
                  <Tr position="sticky" top="0">
                    <Th width="200px" pl="50px" textAlign="center">
                      Wallet
                    </Th>
                    <SortableTh
                      width="200px"
                      textAlign="center"
                      field="reward"
                      currentSortField={currentSortField}
                      currentSortType={currentSortType}
                      onChangeSort={onSort}
                    >
                      Unlock SAV
                    </SortableTh>
                    <SortableTh
                      width="200px"
                      textAlign="center"
                      field="tillTimestamp"
                      currentSortField={currentSortField}
                      currentSortType={currentSortType}
                      onChangeSort={onSort}
                    >
                      End
                    </SortableTh>
                    <SortableTh
                      width="200px"
                      textAlign="center"
                      field="period"
                      currentSortField={currentSortField}
                      currentSortType={currentSortType}
                      onChangeSort={onSort}
                    >
                      Staking plan
                    </SortableTh>
                  </Tr>
                </Thead>
                <Tbody maxH="400px" overflowY="auto">
                  {sortedData.map((stake, index) => (
                    <Tr key={index}>
                      <Td textAlign="center">
                        <Link target="_blank" href={getExplorerLink(chain, stake.user, true)}>
                          {stake.user}
                        </Link>
                      </Td>
                      <Td textAlign="center">
                        {bigNumberToString(
                          stake.isSAVRToken ? stake.profit : stake.amount.add(stake.profit)
                        )}{' '}
                        SAV
                      </Td>
                      <Td textAlign="center">{getLocalDateTimeString(stake.tillTimestamp)}</Td>
                      <Td textAlign="center">{getReadableDuration(stake.period)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </>
        ) : null}
      </Box>
    </AdminSection>
  );
};
