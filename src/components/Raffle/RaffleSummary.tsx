import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { BigNumberish } from 'ethers';

import { Button } from '@/components/ui/Button/Button';
import { SearchWallet } from '@/components/ui/SearchWallet/SearchWallet';
import { useLogger } from '@/hooks/useLogger';
import { trimAddress } from '@/utils/address';
import { RaffleWinners } from '@/utils/formatters/raffle';
import { bigNumberToString, getReadableAmount } from '@/utils/number';

import './raffle.scss';

const PAGE_LIMIT = 10;
type RaffleSummaryProps = {
  userPrize?: BigNumberish;
  winners: RaffleWinners[];
};
export const RaffleSummary: FC<RaffleSummaryProps> = ({ userPrize, winners }) => {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const { isOpen, onToggle, onOpen } = useDisclosure();
  const logger = useLogger({
    category: 'elements',
    action: 'element_click',
    label: 'see_all_winners',
    buttonLocation: 'down',
    actionGroup: 'interactions',
  });

  const sortedWinners = useMemo(() => winners.sort((a, b) => a.level - b.level), [winners]);

  const filteredWinners = useMemo(
    () =>
      sortedWinners.filter(({ address }) =>
        address.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ),
    [sortedWinners, search]
  );

  const handleToggleList = useCallback(() => {
    onToggle();
    logger({ event: 'raffle' });
  }, [logger, onToggle]);

  useEffect(() => {
    setPage(0);
    if (search) {
      onOpen();
    }
  }, [search, onOpen]);

  const fromItem = useMemo(
    () => Math.min(page * PAGE_LIMIT + 1, filteredWinners.length),
    [page, filteredWinners]
  );
  const toItem = useMemo(
    () => Math.min((page + 1) * PAGE_LIMIT, filteredWinners.length),
    [page, filteredWinners]
  );

  const paginatedWinners = useMemo(
    () => filteredWinners.slice(fromItem - 1, toItem),
    [filteredWinners, fromItem, toItem]
  );

  const hasPrevPage = page > 0;
  const hasNextPage = toItem < filteredWinners.length;

  return (
    <Box
      bgColor="bgGreen.50"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      padding={{ sm: '20px 10px 30px', '2xl': '30px 40px 40px' }}
      px={{ md: '20px', lg: '10px', xl: '20px' }}
    >
      <Box textStyle="textSemiBold" textTransform="uppercase">
        <Flex justifyContent="space-between" alignItems="center" mb={{ sm: '10px', '2xl': '20px' }}>
          <Text textStyle="textBold" fontSize={{ sm: '26px', '2xl': '38px' }}>
            Summary
          </Text>

          <SearchWallet
            buttonText="Search wallet"
            onChange={setSearch}
            minWidth="270px"
            variant="secondary"
            event="raffle"
            buttonLocation="down"
          />
        </Flex>

        <Text mb={{ sm: '25px', '2xl': '10px' }} fontSize={{ sm: '12px', '2xl': '16px' }}>
          Congratulations to the raffle winners
        </Text>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          fontSize={{ sm: '12px', '2xl': '16px' }}
        >
          <Button p={0} variant="link" color="red" onClick={handleToggleList} fontSize="inherit">
            See all winners
          </Button>
          <Text color="savr">{bigNumberToString(userPrize || 0)} SAVR</Text>
        </Flex>
      </Box>

      {isOpen ? (
        <>
          <Divider mt={{ sm: '20px', '2xl': '32px' }} borderColor="white" opacity={0.5} />

          <Box mb={{ sm: '20px', '2xl': '40px' }}>
            <table className="raffle-summary__table">
              <thead>
                <tr>
                  <th className="raffle-summary__cell raffle-summary__cell--heading raffle-summary__cell--level">
                    Lvl
                  </th>
                  <th className="raffle-summary__cell raffle-summary__cell--heading raffle-summary__cell--wallet">
                    Wallet
                  </th>
                  <th className="raffle-summary__cell raffle-summary__cell--heading raffle-summary__cell--tickets">
                    Entered with
                  </th>
                  <th className="raffle-summary__cell raffle-summary__cell--heading raffle-summary__cell--prize">
                    Won
                    <br />
                    SAVR
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedWinners.map((winner, index) => (
                  <tr key={index}>
                    <td className="raffle-summary__cell raffle-summary__cell--level">
                      {winner.level + 1}
                    </td>
                    <td className="raffle-summary__cell raffle-summary__cell--wallet">
                      {trimAddress(winner.address, 8)}
                    </td>
                    <td className="raffle-summary__cell raffle-summary__cell--tickets">
                      {winner.tickets}
                    </td>
                    <td className="raffle-summary__cell raffle-summary__cell--prize">
                      {getReadableAmount(winner.prize)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          <Flex justifyContent="space-between" alignItems="center">
            <Text
              textStyle="text1"
              fontSize={{ sm: '12px', '2xl': '18px' }}
              fontWeight={{ sm: '400', '2xl': '500' }}
            >
              {fromItem}-{toItem} of {filteredWinners.length}
            </Text>

            <Box>
              <IconButton
                mr="30px"
                aria-label="prev page"
                isDisabled={!hasPrevPage}
                size="md"
                variant="transparent"
                icon={<ChevronLeftIcon boxSize="2em" />}
                onClick={() => setPage(page - 1)}
              />
              <IconButton
                aria-label="next page"
                isDisabled={!hasNextPage}
                size="md"
                variant="transparent"
                icon={<ChevronRightIcon boxSize="2em" />}
                onClick={() => setPage(page + 1)}
              />
            </Box>
          </Flex>
        </>
      ) : null}
    </Box>
  );
};
