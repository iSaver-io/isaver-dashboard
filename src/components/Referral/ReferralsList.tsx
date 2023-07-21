import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ReactComponent as ChevronDownIcon } from '@/assets/images/icons/chevron-down.svg';
import { ReferralsTable } from '@/components/Referral/ReferralsTable';
import { SearchWallet } from '@/components/ui/SearchWallet/SearchWallet';
import { useUserReferralInfo } from '@/hooks/referral/useReferralManager';
import { useHelperReferralsFullInfoByLevel } from '@/hooks/useHelper';
import { useLogger } from '@/hooks/useLogger';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatReferralsToExport } from '@/utils/formatters/formatReferralsToExport';

import { ExportButton } from '../ui/ExportButton/ExportButton';

const TOTAL_LEVELS = 10;

export const ReferralsList = () => {
  const { address } = useAccount();
  const [levels, setLevels] = useState<number[]>([1]);
  const [search, setSearch] = useState<string>('');
  const referrals = useHelperReferralsFullInfoByLevel(address, levels);
  const { userReferralInfoRequest } = useUserReferralInfo();
  const logger = useLogger({
    event: 'team',
    category: 'elements',
    action: 'element_click',
    label: 'levels',
    buttonLocation: 'mid',
    actionGroup: 'interactions',
  });

  const logLevelSelect = useCallback(
    (level: string | number) => {
      logger({ label: 'level', content: level });
    },
    [logger]
  );

  const handleLevelsSelect = useCallback(
    (value: (number | string)[]) => {
      setLevels(value.map(Number).sort((a, b) => a - b));
    },
    [setLevels]
  );
  const toggleAllLevels = useCallback(
    (e: any) => {
      if (e.target.checked) {
        const allLevels = Array.from({ length: TOTAL_LEVELS }).map((_, index) => index + 1);
        setLevels(allLevels);
      } else {
        setLevels([]);
      }
      logLevelSelect('all');
    },
    [setLevels, logLevelSelect]
  );

  const refCount = useMemo(
    () => userReferralInfoRequest.data?.refCount || [],
    [userReferralInfoRequest.data]
  );

  const levelsTitle = useMemo(() => calculateTitle(levels), [levels]);
  const selectedReferrals = useMemo(
    () =>
      refCount.length > 0
        ? levels.reduce((acc, level) => acc + refCount[level - 1].toNumber(), 0)
        : 0,
    [levels, refCount]
  );
  const totalReferrals = useMemo(
    () => refCount.reduce((acc, count) => acc + count.toNumber(), 0),
    [refCount]
  );

  const filteredReferrals = useMemo(
    () =>
      referrals.filter((ref) => ref.referralAddress.toLowerCase().includes(search.toLowerCase())),
    [referrals, search]
  );

  const exportData = useCallback(() => {
    const { data, headers } = formatReferralsToExport(referrals);
    exportToExcel('isaver_referrals', data, headers);
  }, [referrals]);

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={{ xl: '18px' }}>
        <Menu variant="dark-transparent">
          <MenuButton
            as={Button}
            variant="transparent"
            rightIcon={<ChevronDownIcon />}
            padding={0}
            onClick={() => logger()}
            textTransform="uppercase"
            fontWeight={{ sm: '600', xl: '700' }}
            fontSize={{ sm: '18px', xl: '26px' }}
          >
            Your levels {levelsTitle}
            <Text as="span" opacity="0.5" ml="8px">
              ({selectedReferrals})
            </Text>
          </MenuButton>
          <MenuList p="20px">
            <Checkbox value="all" onChange={toggleAllLevels} spacing={5} mb={5} colorScheme="white">
              <Text textStyle="textSansBold">
                All{' '}
                <Text as="span" opacity="0.5">
                  ({totalReferrals})
                </Text>
              </Text>
            </Checkbox>
            <CheckboxGroup colorScheme="green" value={levels} onChange={handleLevelsSelect}>
              <Stack
                spacing={5}
                ml="-4px"
                pl="4px"
                direction={'column'}
                maxH="280px"
                overflow="auto"
                className="with-custom-scroll"
              >
                {Array.from({ length: TOTAL_LEVELS }).map((_, index) => (
                  <Checkbox
                    key={index}
                    value={index + 1}
                    spacing={5}
                    colorScheme="white"
                    onChange={() => logLevelSelect(index + 1)}
                  >
                    <Text textStyle="textSansBold">
                      {index + 1} Level{' '}
                      <Text as="span" opacity="0.5">
                        ({refCount[index]?.toString() || 0})
                      </Text>
                    </Text>
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </MenuList>
        </Menu>

        <Flex alignItems="center">
          <Box mr={{ sm: '0px', xl: '10px' }}>
            <SearchWallet
              buttonText="Search wallet"
              event="team"
              buttonLocation="mid"
              onChange={setSearch}
            />
          </Box>
          <ExportButton onClick={exportData} event="team" buttonLocation="mid" />
        </Flex>
      </Flex>

      <ReferralsTable referrals={filteredReferrals} />
    </>
  );
};

function calculateTitle(levels: number[]) {
  const calculatedTitle = [...levels, null].reduce(
    (acc, level) => {
      if (!acc.start) {
        acc.start = level;
      } else if (acc.start + acc.groupLength !== level) {
        if (acc.groupLength === 1) {
          acc.parts.push(acc.start);
        }
        if (acc.groupLength === 2) {
          acc.parts.push(acc.start, acc.start + acc.groupLength - 1);
        }
        if (acc.groupLength > 2) {
          acc.parts.push(`${acc.start}-${acc.start + acc.groupLength - 1}`);
        }
        acc.start = level;
        acc.groupLength = 0;
      }

      acc.groupLength += 1;
      return acc;
    },
    {
      parts: [],
      groupLength: 0,
      start: undefined,
    } as any
  );

  return calculatedTitle.parts.join(', ');
}
