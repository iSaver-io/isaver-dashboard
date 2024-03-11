import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Link, Text, useDisclosure } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useBuyTickets, useTicketPrice } from '@/hooks/raffle/useRaffle';
import { useMomento } from '@/hooks/useMomento';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { useTicketsBalance } from '@/hooks/useTicketsBalance';

import { BuyRaffleTicketsModal } from '../Raffle/BuyRaffleTicketsModal';

import { MainSlider } from './MainSlider';
import { MomentoPrize } from './MomentoPrize';
import { Ticket } from './Ticket';

export const Main = () => {
  const [isActive, setActive] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buyTickets = useBuyTickets();
  const { data: balance } = useTicketsBalance();
  const { ticketPrice } = useTicketPrice();
  const { address } = useAccount();
  const { hasPendingRequest, isOracleResponseReady, burnTicket, getPrize, isGetPrizeConfirmed } =
    useMomento();
  const navigate = useNavigateByHash();

  const handleNavigateToClaimTickets = useCallback(() => {
    navigate('/#claim-ticket');
  }, [navigate]);

  useEffect(() => {
    if (getPrize.data || address || !address) {
      setActive(false);
    }
  }, [getPrize.data, address]);

  return (
    <Box>
      <Link
        as={RouterLink}
        to="/"
        textStyle="button"
        alignSelf="flex-start"
        mb={{ sm: '30px', '2xl': '40px' }}
        display={{ base: 'none', lg: 'block' }}
      >
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>
      <Box textAlign="center">
        <Text textStyle="h1" as="h1" fontSize={{ sm: '26px', md: '38px', xl: '90px' }} margin={0}>
          MOMENTO
        </Text>
        <Text textStyle="text1" mt="20px" maxW="600px" mx="auto">
          Instant{' '}
          <Text as="span" color="sav">
            Win-Win
          </Text>{' '}
          Raffle of various NFTs and SAVR tokens. Anyone with iSaver Raffle Tickets can join the fun
          and win exciting{' '}
          <Text as="span" color="sav">
            prizes
          </Text>
        </Text>
        <Flex
          mt={{ base: '24px', lg: '36px' }}
          alignItems="center"
          justifyContent="center"
          gap="24px"
        >
          <Text textStyle="menuDefault">Your Tickets: </Text>
          <Text textStyle="heading1">{balance || 0}</Text>
        </Flex>
        <Flex
          className="momento_actions prevent-select"
          mt={{ base: '24px', lg: '36px' }}
          alignItems="center"
          justifyContent="space-around"
          gap="24px"
          flexDir={{ base: 'column', lg: 'row' }}
        >
          <Flex flexDir={{ base: 'row', lg: 'column' }} gap={{ base: '20px', lg: '8px' }}>
            <Button
              w="160px"
              variant="outlinedWhite"
              onClick={handleNavigateToClaimTickets}
              size={{ base: 'md', lg: 'lg' }}
            >
              mint ticket
            </Button>
            <Text textStyle="text2" display={{ base: 'none', lg: 'block' }}>
              OR
            </Text>
            <Button
              w="160px"
              variant="outlinedGreen"
              onClick={onOpen}
              size={{ base: 'md', lg: 'lg' }}
            >
              buy tickets
            </Button>
          </Flex>
          <Ticket isActive={isActive} setActive={setActive} />
          <Flex flexDir={{ base: 'row', lg: 'column' }} gap={{ base: '20px', lg: '8px' }}>
            <Button
              w="160px"
              isDisabled={!isActive || Boolean(hasPendingRequest) || Boolean(isOracleResponseReady)}
              size={{ base: 'md', lg: 'lg' }}
              onClick={() => burnTicket.mutateAsync()}
              isLoading={
                burnTicket.isLoading || (Boolean(hasPendingRequest) && !isOracleResponseReady)
              }
            >
              Burn
            </Button>
            <Text textStyle="text2" display={{ base: 'none', lg: 'block' }}>
              AND
            </Text>
            <Button
              w="160px"
              isDisabled={!isOracleResponseReady}
              size={{ base: 'md', lg: 'lg' }}
              onClick={() => getPrize.mutateAsync()}
              isLoading={getPrize.isLoading}
            >
              Go!
            </Button>
          </Flex>
        </Flex>
      </Box>
      {getPrize.data ? (
        <MomentoPrize prizeInfo={getPrize.data} />
      ) : (
        <MainSlider isLoading={isGetPrizeConfirmed} />
      )}
      {isOpen ? (
        <BuyRaffleTicketsModal
          isPageView
          ticketPrice={ticketPrice}
          onBuy={buyTickets.mutateAsync}
          onClose={onClose}
        />
      ) : null}
    </Box>
  );
};
