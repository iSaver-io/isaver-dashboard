import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, Link, Text, useDisclosure } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useBuyTickets, useTicketPrice } from '@/hooks/raffle/useRaffle';
import { PrizeInfo, useMomento } from '@/hooks/useMomento';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { useTicketsBalance } from '@/hooks/useTicketsBalance';

import { BuyRaffleTicketsModal } from '../Raffle/BuyRaffleTicketsModal';

import { MainSlider } from './MainSlider';
import { Ticket } from './Ticket';

export const Main = () => {
  const [isActive, setActive] = useState(false);
  const [ticketTip, setTicketTip] = useState('');
  const [isSuccessGetPrize, setIsSuccessGetPrize] = useState(false);
  const [prizeInfo, setPrizeInfo] = useState<PrizeInfo>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buyTickets = useBuyTickets();
  const { data: balance } = useTicketsBalance();
  const { ticketPrice } = useTicketPrice();
  const { address } = useAccount();
  const {
    hasPendingRequest,
    isOracleResponseReady,
    burnTicket,
    getPrize,
    isBurnTicketConfirmed,
    isGetPrizeConfirmed,
  } = useMomento();
  const navigate = useNavigateByHash();

  const handleNavigateToClaimTickets = useCallback(() => {
    navigate('/#claim-ticket');
  }, [navigate]);

  useEffect(() => {
    if (
      (burnTicket.isLoading && !isBurnTicketConfirmed) ||
      (getPrize.isLoading && !isGetPrizeConfirmed)
    ) {
      setTicketTip('Confirm transaction in your wallet app');
    } else if (
      (burnTicket.isLoading && isBurnTicketConfirmed) ||
      (getPrize.isLoading && isGetPrizeConfirmed)
    ) {
      setTicketTip('Waiting for transaction...');
    } else if (Boolean(hasPendingRequest) && !isOracleResponseReady) {
      setTicketTip('Waiting for Oracle response...');
    } else if (isOracleResponseReady) {
      setTicketTip('Hit GO');
    } else if (getPrize.data) {
      setTicketTip('Congrats!');
    } else if (isActive) {
      setTicketTip('Burn the Ticket and hit GO');
    }
  }, [
    burnTicket.isLoading,
    getPrize.isLoading,
    getPrize.data,
    isBurnTicketConfirmed,
    isGetPrizeConfirmed,
    hasPendingRequest,
    isOracleResponseReady,
    isActive,
  ]);

  useEffect(() => {
    setActive(false);
    setTicketTip('');
  }, [address]);

  useEffect(() => {
    if (getPrize.data) {
      setActive(false);
      setTicketTip('');
    }
    setPrizeInfo(getPrize.data);
    setIsSuccessGetPrize(getPrize.isSuccess);
  }, [getPrize.data, getPrize.isSuccess]);

  useEffect(() => {
    if (isActive) {
      setPrizeInfo(undefined);
      setIsSuccessGetPrize(false);
    }
  }, [isActive]);

  return (
    <>
      <Container className="momento" variant="dashboard">
        <Box>
          <Link
            as={RouterLink}
            to="/"
            textStyle="button"
            alignSelf="flex-start"
            mb="16px"
            display={{ base: 'none', lg: 'block' }}
          >
            <ArrowBackIcon w="24px" h="24px" mr="10px" />
            Back
          </Link>
          <Box textAlign="center">
            <Text
              textStyle="h1"
              as="h1"
              fontSize={{ sm: '26px', md: '38px', xl: '90px' }}
              margin={0}
            >
              MOMENTO
            </Text>
            <Text
              textStyle={{ base: 'note', lg: 'text1' }}
              mt="20px"
              maxW={{ base: '290px', md: '360px', lg: '460px', xl: '600px' }}
              mx="auto"
            >
              Instant{' '}
              <Text as="span" color="sav" fontWeight={{ base: '600', lg: '400' }}>
                Win-Win
              </Text>{' '}
              Raffle of various NFTs and SAVR tokens. Anyone with iSaver Raffle Tickets can join the
              fun and win exciting{' '}
              <Text as="span" color="sav" fontWeight={{ base: '600', lg: '400' }}>
                prizes
              </Text>
            </Text>
            <Flex
              mt={{ base: '30px', xl: '40px', '2xl': '36px' }}
              alignItems="center"
              justifyContent="center"
              gap={{ base: '15px', xl: '24px' }}
            >
              <Text textStyle={{ base: 'body1', xl: 'menuDefault' }}>Your Tickets: </Text>
              <Text
                textStyle={{ base: 'menuDefault', xl: 'body1' }}
                fontSize={{ base: '26px', xl: '55px' }}
              >
                {balance || 0}
              </Text>
            </Flex>
            <Flex
              className="momento_actions prevent-select"
              alignItems="center"
              justifyContent="center"
              gap={{ lg: '50px', xl: '115px', '2xl': '150px' }}
              flexDir={{ base: 'column', lg: 'row' }}
              mt={{ base: '30px', lg: '0' }}
            >
              <Flex flexDir={{ base: 'row', lg: 'column' }} gap={{ base: '20px', lg: '8px' }}>
                <Button
                  w={{ base: '120px', xl: '160px' }}
                  h={{ base: '30px', xl: '45px' }}
                  size={{ base: 'sm', xl: 'md' }}
                  fontSize="12px !important"
                  variant="outlinedWhite"
                  onClick={handleNavigateToClaimTickets}
                >
                  mint ticket
                </Button>
                <Text textStyle="textSansSmall" display={{ base: 'none', lg: 'block' }}>
                  OR
                </Text>
                <Button
                  w={{ base: '120px', xl: '160px' }}
                  h={{ base: '30px', xl: '45px' }}
                  size={{ base: 'sm', xl: 'md' }}
                  fontSize="12px !important"
                  variant="outlinedGreen"
                  onClick={onOpen}
                >
                  buy tickets
                </Button>
              </Flex>
              <Ticket tip={ticketTip} isActive={isActive} setActive={setActive} />
              <Flex flexDir={{ base: 'row', lg: 'column' }} gap={{ base: '20px', lg: '8px' }}>
                <Button
                  w={{ base: '120px', xl: '160px' }}
                  h={{ base: '30px', xl: '45px' }}
                  size={{ base: 'sm', xl: 'md' }}
                  fontSize="12px !important"
                  isDisabled={
                    !isActive ||
                    Boolean(hasPendingRequest) ||
                    Boolean(isOracleResponseReady) ||
                    getPrize.isLoading
                  }
                  onClick={() => burnTicket.mutateAsync()}
                  isLoading={
                    burnTicket.isLoading || (Boolean(hasPendingRequest) && !isOracleResponseReady)
                  }
                >
                  Burn
                </Button>
                <Text textStyle="textSansSmall" display={{ base: 'none', lg: 'block' }}>
                  AND
                </Text>
                <Button
                  w={{ base: '120px', xl: '160px' }}
                  h={{ base: '30px', xl: '45px' }}
                  size={{ base: 'sm', xl: 'md' }}
                  fontSize="12px !important"
                  isDisabled={!isOracleResponseReady}
                  onClick={() => getPrize.mutateAsync()}
                  isLoading={getPrize.isLoading}
                >
                  Go!
                </Button>
              </Flex>
            </Flex>
          </Box>
          {isOpen ? (
            <BuyRaffleTicketsModal
              isPageView
              ticketPrice={ticketPrice}
              onBuy={buyTickets.mutateAsync}
              onClose={onClose}
            />
          ) : null}
        </Box>
      </Container>
      <Box h={{ base: '220px', xl: '460px' }}>
        <MainSlider
          isSuccess={isSuccessGetPrize}
          isLoading={isGetPrizeConfirmed}
          prizeInfo={prizeInfo}
        />
      </Box>
    </>
  );
};
