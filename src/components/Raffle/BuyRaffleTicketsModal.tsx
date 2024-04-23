import { FC, useCallback, useMemo, useState } from 'react';
import {
  Box,
  CloseButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { InputAmount } from '@/components/ui/InputAmount/InputAmount';
import { useDebounce } from '@/hooks/useDebounce';
import { EventContext, EventName, useLogger } from '@/hooks/useLogger';
import { useSavBalance } from '@/hooks/useTokenBalance';
import { bigNumberToString } from '@/utils/number';

const boxCommonStyles = {
  bgColor: 'gray.200',
  borderRadius: 'sm',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 20px',
  textStyle: 'textSansBold',
};

type BuyRaffleTicketsModalProps = {
  ticketPrice: BigNumber;
  event: EventName;
  context: EventContext;
  onClose: () => void;
  onBuy: (amount: number) => Promise<void>;
};
export const BuyRaffleTicketsModal: FC<BuyRaffleTicketsModalProps> = ({
  ticketPrice,
  event,
  context,
  onClose,
  onBuy,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number>();
  const { address } = useAccount();
  const { data: savBalance } = useSavBalance(address);
  const logger = useLogger({
    event,
    context,
    buttonLocation: 'popup',
  });

  const debouncedLogger = useDebounce(logger);

  const totalPrice = useMemo(() => ticketPrice.mul(amount || 0), [amount, ticketPrice]);
  const isValid = useMemo(() => totalPrice.lte(savBalance || 0), [totalPrice, savBalance]);

  const handleUpdate = useCallback(
    (val?: string) => {
      const MAX_VALUE = 1_000_000;
      let value = Math.floor(Math.min(Number(val) || 0, MAX_VALUE));

      setAmount(value || undefined);

      debouncedLogger({
        category: 'forms',
        action: 'form_add',
        label: 'amount',
        value,
        actionGroup: 'interactions',
      });
    },
    [setAmount, debouncedLogger]
  );

  const handleBuy = useCallback(() => {
    if (!amount) return;
    setIsLoading(true);
    onBuy(amount)
      .then(() => {
        setAmount(undefined);
        onClose();
      })
      .finally(() => {
        setIsLoading(false);
      });

    logger({
      category: 'elements',
      action: 'button_click',
      label: 'buy_tickets',
      value: amount,
      actionGroup: 'conversions',
    });
  }, [amount, onBuy, onClose, logger]);

  return (
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="textSansBold" fontSize="26px">
            Buy Raffle Tickets
          </Text>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Text mt="26px" mb="10px" textStyle="textSansBold">
            Enter the number of Tickets
          </Text>
          <InputAmount placeholder="0" value={amount} onChange={handleUpdate} hasError={!isValid} />

          <Text mt="6px" mb="10px" textStyle="textSansBold">
            Price per Ticket
          </Text>
          <Box {...boxCommonStyles} mb="30px">
            {bigNumberToString(ticketPrice)}
            <Spacer />
            SAV
          </Box>

          <Text mb="10px" textStyle="textSansBold">
            Total amount
          </Text>
          <Box {...boxCommonStyles}>
            {bigNumberToString(totalPrice)}
            <Spacer />
            SAV
          </Box>
          <Text textStyle="textSansExtraSmall" textAlign="right" mt="8px" height="16px" mb="10px">
            You have: {bigNumberToString(savBalance || 0)} SAV
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleBuy}
            isDisabled={!amount || !isValid || isLoading}
            isLoading={isLoading}
          >
            Buy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
