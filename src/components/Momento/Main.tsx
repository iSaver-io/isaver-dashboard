import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Link, Text, useDisclosure } from '@chakra-ui/react';

import { useRaffle, useRaffleControl } from '@/hooks/raffle/useRaffle';
import { useMomento } from '@/hooks/useMomento';
import { useTicketSupply } from '@/hooks/useTickets';

import { BuyRaffleTicketsModal } from '../Raffle/BuyRaffleTicketsModal';

import { MainSlider } from './MainSlider';
import { Ticket } from './Ticket';

export const Main = () => {
  const [isActive, setActive] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { buyTickets } = useRaffle();
  const { balance } = useTicketSupply();
  const { ticketPrice } = useRaffleControl();
  const { isTicketBurned, isOracleResponseReady, burnTicket, getPrize } = useMomento();

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
          <Text textStyle="heading1">{balance.data || 0}</Text>
        </Flex>
        <Flex
          className="momento_actions"
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
              as={RouterLink}
              to="/"
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
              isDisabled={!isActive || !!isTicketBurned}
              size={{ base: 'md', lg: 'lg' }}
              onClick={() => burnTicket.mutateAsync()}
              isLoading={burnTicket.isLoading}
            >
              Burn
            </Button>
            <Text textStyle="text2" display={{ base: 'none', lg: 'block' }}>
              OR
            </Text>
            <Button
              w="160px"
              isDisabled={!isTicketBurned && !isOracleResponseReady}
              size={{ base: 'md', lg: 'lg' }}
              onClick={() => getPrize.mutateAsync()}
              isLoading={getPrize.isLoading}
            >
              Go!
            </Button>
          </Flex>
        </Flex>
      </Box>
      <MainSlider />
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
