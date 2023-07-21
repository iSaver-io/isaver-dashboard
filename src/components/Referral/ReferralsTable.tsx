import { FC, useCallback, useMemo } from 'react';
import { Box, Center, Tbody, Td, Thead, Tr, useDisclosure } from '@chakra-ui/react';

import { Button } from '@/components/ui/Button/Button';
import { Table } from '@/components/ui/Table/Table';
import { SortType, useDataSorting } from '@/hooks/useDataSorting';
import { useLogger } from '@/hooks/useLogger';
import { Referral } from '@/types';
import { getReadableAmount } from '@/utils/number';
import { getLocalDateTimeString } from '@/utils/time';

import { SortableTh } from '../ui/Table/SortableTh';

const COLLAPSED_LIMIT = 6;

type ReferralsTableProps = {
  referrals: Referral[];
};
export const ReferralsTable: FC<ReferralsTableProps> = ({ referrals }) => {
  const { isOpen, onToggle } = useDisclosure();
  const logger = useLogger({
    event: 'team',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'mid',
    actionGroup: 'interactions',
  });

  const { sortedData, currentSortField, currentSortType, onSort } = useDataSorting(
    referrals,
    [
      'level',
      'referralAddress',
      'activationDate',
      'savBalance',
      'savrBalance',
      'isStakingSubscriptionActive',
      'isReferralSubscriptionActive',
      'isSquadSubscriptionActive',
      'isLevelSubscriptionActive',
    ],
    {
      field: 'activationDate',
      type: 'asc',
    }
  );

  const handleSort = useCallback(
    (field: string, type: SortType) => {
      onSort(field, type);
      logger({ label: 'sort', content: field });
    },
    [onSort, logger]
  );

  const handleToggleTable = useCallback(() => {
    onToggle();
    logger({ label: isOpen ? 'less' : 'more', context: 'teams' });
  }, [onToggle, logger, isOpen]);

  const visibleItems = useMemo(
    () => (isOpen ? sortedData : sortedData.slice(0, COLLAPSED_LIMIT)),
    [isOpen, sortedData]
  );

  const emptyRows = Math.max(0, COLLAPSED_LIMIT - visibleItems.length);

  const RedCircle = (
    <Box display="inline-block" width="16px" height="16px" borderRadius="50%" bgColor="error" />
  );
  const GreenCircle = (
    <Box display="inline-block" width="16px" height="16px" borderRadius="50%" bgColor="green.400" />
  );

  return (
    <Box className="table-responsive-wrapper">
      <Table>
        <Thead>
          <Tr>
            <SortableTh
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
              width="360px"
              field="referralAddress"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Wallet
            </SortableTh>
            <SortableTh
              textAlign="center"
              field="activationDate"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Start
            </SortableTh>
            <SortableTh
              textAlign="center"
              width="200px"
              field="savBalance"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              SAV
            </SortableTh>
            <SortableTh
              textAlign="center"
              width="200px"
              field="savrBalance"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              SAVR
            </SortableTh>
            <SortableTh
              width="90px"
              field="isStakingSubscriptionActive"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Staking
            </SortableTh>
            <SortableTh
              width="90px"
              field="isReferralSubscriptionActive"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Referral
            </SortableTh>
            <SortableTh
              width="90px"
              field="isSquadSubscriptionActive"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Team
            </SortableTh>
            <SortableTh
              width="90px"
              field="isLevelSubscriptionActive"
              currentSortField={currentSortField}
              currentSortType={currentSortType}
              onChangeSort={handleSort}
            >
              Status
            </SortableTh>
          </Tr>
        </Thead>
        <Tbody>
          {visibleItems.map((referral) => (
            <Tr key={referral.referralAddress}>
              <Td textAlign="center">{referral.level}</Td>
              <Td textAlign="center">{referral.referralAddress}</Td>
              <Td textAlign="center">{getLocalDateTimeString(referral.activationDate)}</Td>
              <Td textAlign="center">{getReadableAmount(referral.savBalance)}</Td>
              <Td textAlign="center">{getReadableAmount(referral.savrBalance)}</Td>
              <Td textAlign="center">
                {referral.isStakingSubscriptionActive ? GreenCircle : RedCircle}
              </Td>
              <Td textAlign="center">
                {referral.isReferralSubscriptionActive ? GreenCircle : RedCircle}
              </Td>
              <Td textAlign="center">
                {referral.isSquadSubscriptionActive ? GreenCircle : RedCircle}
              </Td>
              <Td textAlign="center">
                {referral.isLevelSubscriptionActive ? GreenCircle : RedCircle}
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
              <Td></Td>
              <Td></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {referrals.length > COLLAPSED_LIMIT ? (
        <Center mt="10px">
          <Button variant="link" onClick={handleToggleTable}>
            {isOpen ? 'Less' : 'More'}
          </Button>
        </Center>
      ) : null}
    </Box>
  );
};
