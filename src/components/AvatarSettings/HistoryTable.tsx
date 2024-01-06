import { useCallback, useMemo } from 'react';
import { Box, Center, Flex, Tbody, Td, Text, Thead, Tr, useDisclosure } from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';
import { SortableTh } from '@/components/ui/Table/SortableTh';
import { Table } from '@/components/ui/Table/Table';
import { useAllEvents } from '@/hooks/useAvatarSettings';
import { SortType, useDataSorting } from '@/hooks/useDataSorting';
import { useNFT } from '@/hooks/useNFTHolders';
import { getLocalDateTimeString } from '@/utils/time';

import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';
import { ExportButton } from '../ui/ExportButton/ExportButton';

const COLLAPSED_LIMIT = 6;

export const HistoryTable = () => {
  const { isNFTCorrect } = useNFT();
  const { events, isLoading } = useAllEvents();
  const { isOpen, onToggle } = useDisclosure();

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

  return isNFTCorrect ? (
    <Box className="history">
      <Box textAlign="center">
        <Text textStyle="h2" as="h2" textTransform="uppercase">
          History
        </Text>
      </Box>
      <Flex
        justifyContent="flex-end"
        alignItems="center"
        mt={15}
        mb={5}
        paddingX={{ sm: '10px', md: 'unset' }}
      >
        <ExportButton onClick={() => {}} event="avatarSettings" buttonLocation="up" />
      </Flex>
      <Table>
        <Thead>
          <Tr>
            <SortableTh
              w="150px"
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
              minW="170px"
              textAlign="center"
              field="label"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Event
            </SortableTh>
            <SortableTh
              minW="220px"
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
              <Td pr="50px" textAlign="center" maxW="220px">
                <Text overflow="hidden" textOverflow="ellipsis">
                  {transactionHash}
                </Text>
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

      {events.length > COLLAPSED_LIMIT ? (
        <Center mt="10px">
          <Button variant="link" onClick={handleToggleTable}>
            {isOpen ? 'Less' : 'More'}
          </Button>
        </Center>
      ) : null}
    </Box>
  ) : null;
};
