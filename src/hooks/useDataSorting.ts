import { useCallback, useMemo, useState } from 'react';

import { compareTwoFields } from '@/utils/compareTwoFields';

export type SortType = 'asc' | 'desc';
// TODO: Fix typescript, add type for sortable fields
export const useDataSorting = <T extends object>(
  data: T[],
  sortableFields: string[],
  initialSorting?: { field: string; type: SortType }
) => {
  const [currentSortField, setCurrentSortField] = useState(
    initialSorting?.field || sortableFields[0]
  );
  const [currentSortType, setCurrentSortType] = useState(initialSorting?.type || 'asc');

  // Hotfix for unique transaction hashes
  const uniqueData = useMemo(() => {
    const uniqueMap = new Map<string, any>();
    data.forEach((d) => {
      const key = JSON.stringify(d);
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, d);
      }
    });
    return Array.from(uniqueMap.values());
  }, [data]);

  const sortedData = useMemo(
    () =>
      [...uniqueData].sort((a, b) =>
        currentSortType === 'asc'
          ? // @ts-ignore
            compareTwoFields(a[currentSortField], b[currentSortField])
          : // @ts-ignore
            compareTwoFields(b[currentSortField], a[currentSortField])
      ),
    [uniqueData, currentSortField, currentSortType]
  );

  const onSort = useCallback(
    (field: string, type: SortType) => {
      if (!sortableFields.includes(field))
        throw new Error(`Incorrect sort field: ${field}. Expected: [${sortableFields.join(', ')}]`);

      setCurrentSortField(field);
      setCurrentSortType(type);
    },
    [sortableFields, setCurrentSortField, setCurrentSortType]
  );

  return {
    sortedData,
    currentSortField,
    currentSortType,
    onSort,
  };
};
