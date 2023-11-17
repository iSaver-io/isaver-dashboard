import { FC, useCallback, useState } from 'react';
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
import { useLogger } from '@/hooks/useLogger';
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
  isPageView?: boolean;
  onClose: () => void;
  onBuy: (amount: number) => Promise<void>;
};
export const BuyRaffleTicketsModal: FC<BuyRaffleTicketsModalProps> = ({
  ticketPrice,
  isPageView,
  onClose,
  onBuy,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number>();
  const { address } = useAccount();
  const { data: savBalance } = useSavBalance(address);
  const logger = useLogger({
    context: 'raffles',
    buttonLocation: 'popup',
  });

  const debouncedLogger = useDebounce(logger);

  const handleUpdate = useCallback(
    (val?: string) => {
      const MAX_VALUE = 1_000_000;
      let value = Math.min(Number(val) || 0, MAX_VALUE);

      setAmount(value || undefined);

      debouncedLogger({
        event: isPageView ? 'raffle' : 'dashboard',
        category: 'forms',
        action: 'form_add',
        label: 'amount',
        content: value,
        actionGroup: 'interactions',
      });
    },
    [setAmount, debouncedLogger, isPageView]
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
      event: isPageView ? 'raffle' : 'dashboard',
      category: 'elements',
      action: 'button_click',
      label: 'buy_tickets',
      content: amount,
      actionGroup: 'conversions',
    });
  }, [amount, onBuy, onClose, logger, isPageView]);

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
          <InputAmount placeholder="0" value={amount} onChange={handleUpdate} />

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
            {bigNumberToString(ticketPrice.mul(amount || 0))}
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
            isDisabled={!amount || isLoading}
            isLoading={isLoading}
          >
            Buy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
