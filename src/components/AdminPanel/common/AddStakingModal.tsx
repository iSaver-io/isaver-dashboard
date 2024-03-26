import { FC, useCallback, useState } from 'react';
import {
  Box,
  Checkbox,
  CloseButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

import { Button } from '@/components/ui/Button/Button';

type AddStakingModalProps = {
  onClose: () => void;
  onSubmit: ({
    subscriptionCost,
    stakingDuration,
    apr,
    isSuperPowered,
  }: {
    subscriptionCost: BigNumber;
    stakingDuration: number;
    apr: number;
    isSuperPowered: boolean;
  }) => Promise<void>;
};
export const AddStakingModal: FC<AddStakingModalProps> = ({ onClose, onSubmit }) => {
  const [subscriptionCost, setSubscriptionCost] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [apr, setApr] = useState<string>();
  const [isSuperPowered, setIsSuperPowered] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(() => {
    if (subscriptionCost && duration && apr) {
      const subscriptionCostBN = parseEther(subscriptionCost || '0');
      const durationDays = parseInt(duration);
      const formattedAPR = Math.floor(parseFloat(apr || '0') * 10);

      setIsLoading(true);
      onSubmit({
        subscriptionCost: subscriptionCostBN,
        stakingDuration: durationDays,
        apr: formattedAPR,
        isSuperPowered,
      }).finally(() => setIsLoading(false));
    }
  }, [subscriptionCost, duration, apr, setIsLoading, onSubmit, isSuperPowered]);

  const isDataValid = Boolean(
    (subscriptionCost && duration && apr) || (isSuperPowered && duration && apr)
  );

  return (
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          Create new Staking plan
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Box mb="20px">
            <Checkbox
              colorScheme="green"
              isChecked={isSuperPowered}
              onChange={(e) => setIsSuperPowered(e.target.checked)}
            >
              <Text textStyle="text1">Accessed only with power B?</Text>
            </Checkbox>
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Subscription cost:
            </Text>
            <Input
              type="number"
              placeholder="SAV"
              isDisabled={isSuperPowered}
              onChange={(e) => setSubscriptionCost(e.target.value)}
            />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Staking duration:
            </Text>
            <Input type="number" placeholder="Days" onChange={(e) => setDuration(e.target.value)} />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              APR:
            </Text>
            <Input type="number" placeholder="%" onChange={(e) => setApr(e.target.value)} />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleSubmit}
            isDisabled={!isDataValid || isLoading}
            isLoading={isLoading}
          >
            Create staking plan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type AddSuperStakingModalProps = {
  onClose: () => void;
  onSubmit: ({ apr }: { apr: number }) => Promise<void>;
};
export const AddSuperStakingModal: FC<AddSuperStakingModalProps> = ({ onClose, onSubmit }) => {
  const [apr, setApr] = useState<string>();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(() => {
    if (apr) {
      const formattedAPR = Math.floor(parseFloat(apr || '0') * 10);

      setIsLoading(true);
      onSubmit({ apr: formattedAPR }).finally(() => setIsLoading(false));
    }
  }, [apr, setIsLoading, onSubmit]);

  const isDataValid = Boolean(apr);

  return (
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          Create new Super Staking plan
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              APR:
            </Text>
            <Input type="number" placeholder="%" onChange={(e) => setApr(e.target.value)} />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleSubmit}
            isDisabled={!isDataValid || isLoading}
            isLoading={isLoading}
          >
            Create super staking plan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
