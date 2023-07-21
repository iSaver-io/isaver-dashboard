import { FC, ReactElement, useCallback } from 'react';
import { ArrowUpDownIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, TableColumnHeaderProps, Th } from '@chakra-ui/react';

import { SortType } from '@/hooks/useDataSorting';

type SortableThProps = TableColumnHeaderProps & {
  field: string;
  currentSortField: string;
  currentSortType: SortType;

  children: string | ReactElement;

  onChangeSort: (field: string, sort: 'asc' | 'desc') => void;
};
export const SortableTh: FC<SortableThProps> = ({
  field,
  currentSortField,
  currentSortType,
  children,
  onChangeSort,
  ...props
}) => {
  const onClick = useCallback(() => {
    const isAsc = field === currentSortField && currentSortType === 'asc';
    onChangeSort(field, isAsc ? 'desc' : 'asc');
  }, [onChangeSort, field, currentSortField, currentSortType]);

  const isCurrentField = field === currentSortField;
  const isAscSort = isCurrentField && currentSortType === 'asc';
  const isDescSort = isCurrentField && currentSortType === 'desc';

  return (
    <Th {...props} paddingX="18px">
      <Flex
        height="100%"
        alignItems="center"
        justifyContent={props.textAlign}
        cursor="pointer"
        userSelect="none"
        onClick={onClick}
      >
        <Box as="span" mr="4px">
          {children}
        </Box>
        <Box>
          {!isCurrentField && <ArrowUpDownIcon width="12px" />}
          {isAscSort && <ChevronUpIcon width="28px" mx="-8px" />}
          {isDescSort && <ChevronDownIcon width="28px" mx="-8px" />}
        </Box>
      </Flex>
    </Th>
  );
};
