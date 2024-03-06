import { useCallback, useMemo } from 'react';
import {
  Box,
  Center,
  Flex,
  Link,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useNetwork } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { SortableTh } from '@/components/ui/Table/SortableTh';
import { Table } from '@/components/ui/Table/Table';
import { SortType, useDataSorting } from '@/hooks/useDataSorting';
import { useAllPrizes } from '@/hooks/useMomento';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatHistoryEventsToExport } from '@/utils/formatters/formatHistoryEventsToExport';
import { getExplorerLink } from '@/utils/getExplorerLink';
import { getLocalDateTimeString } from '@/utils/time';

import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';
import { ExportButton } from '../ui/ExportButton/ExportButton';

const COLLAPSED_LIMIT = 6;

export const HistoryTable = () => {
  const { data: events, isFetching, isFetched } = useAllPrizes();
  const isLoading = isFetching && !isFetched;
  const { isOpen, onToggle } = useDisclosure();
  const { chain } = useNetwork();

  const { sortedData, currentSortField, currentSortType, onSort } = useDataSorting(
    events,
    ['timestamp', 'label', 'transactionHash'],
    { field: 'timestamp', type: 'desc' }
  );

  const visibleItems = useMemo(
    () => (isOpen ? sortedData : sortedData.slice(0, COLLAPSED_LIMIT)),
    [isOpen, sortedData]
  );

  const emptyRows = Math.max(0, COLLAPSED_LIMIT - visibleItems.length);

  const handleSort = useCallback(
    (field: string, type: SortType) => {
      onSort(field, type);
    },
    [onSort]
  );

  const handleToggleTable = useCallback(() => {
    onToggle();
  }, [onToggle]);

  const exportData = useCallback(() => {
    const { data, headers } = formatHistoryEventsToExport(events);
    exportToExcel('isaver_momento_prizes', data, headers);
  }, [events]);

  return (
    <Box className="history">
      <Flex justifyContent="center" position="relative">
        <Box textAlign="center" mb={{ sm: '20px', lg: '30px', xl: '50px', '2xl': '63px' }}>
          <Text textStyle="h2" as="h2" textTransform="uppercase">
            You won
          </Text>
        </Box>
        <Box position="absolute" right="0" bottom="6px">
          <ExportButton onClick={exportData} event="avatarSettings" buttonLocation="up" />
        </Box>
      </Flex>
      <Box className="table-responsive-wrapper">
        <Table>
          <Thead>
            <Tr>
              <SortableTh
                width="150px"
                pl="50px"
                textAlign="center"
                field="timestamp"
                currentSortField={currentSortField}
                currentSortType={currentSortType}
                onChangeSort={handleSort}
              >
                Date
              </SortableTh>
              <SortableTh
                width="170px"
                textAlign="center"
                field="label"
                currentSortField={currentSortField}
                currentSortType={currentSortType}
                onChangeSort={handleSort}
              >
                Prize
              </SortableTh>
              <SortableTh
                width="220px"
                pr="50px"
                textAlign="center"
                field="transactionHash"
                currentSortField={currentSortField}
                currentSortType={currentSortType}
                onChangeSort={handleSort}
              >
                Transaction
              </SortableTh>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? <CenteredSpinner /> : null}
            {visibleItems.map(({ timestamp, transactionHash, label }) => (
              <Tr key={transactionHash}>
                <Td pl="50px" textAlign="center">
                  {getLocalDateTimeString(timestamp)}
                </Td>
                <Td textAlign="center">{label}</Td>
                <Td
                  pr="50px"
                  textAlign="center"
                  maxW="220px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  <Link target="_blank" href={getExplorerLink(chain, transactionHash, false)}>
                    {transactionHash}
                  </Link>
                </Td>
              </Tr>
            ))}
            {Array.from({ length: emptyRows }).map((_, index) => (
              <Tr key={`empty-${index}`}>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {0 > COLLAPSED_LIMIT ? (
        <Center mt="24px">
          <Button variant="link" onClick={handleToggleTable}>
            {isOpen ? 'Less' : 'More'}
          </Button>
        </Center>
      ) : null}
    </Box>
  );
};
