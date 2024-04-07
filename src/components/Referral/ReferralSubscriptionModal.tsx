import { FC, useCallback, useState } from 'react';
import {
  Box,
  CloseButton,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { BigNumberish } from 'ethers';

import { ReactComponent as CheckIcon } from '@/assets/images/icons/check.svg';
import { Button } from '@/components/ui/Button/Button';
import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { Tip } from '@/components/ui/Tip/Tip';
import {
  REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION,
  useUserReferralSubscription,
} from '@/hooks/referral/useReferralManager';
import { useLogger } from '@/hooks/useLogger';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { bigNumberToString, getReadableAmount } from '@/utils/number';
import { getLocalDateString, getReadableDuration } from '@/utils/time';

const hasActivePrevSubscription = (subscriptions: number[], index: number) => {
  if (index === 0) return true;
  return subscriptions[index - 1] > Date.now() / 1000;
};

type ReferralSubscriptionModalProps = {
  isOpen: boolean;
  fullSubscriptionCost: BigNumberish;
  levelSubscriptionCost: BigNumberish;
  subscriptionDuration: number;
  fullSubscriptionTill: number;
  levelsSubscriptionTill: number[];
  isLoading: boolean;
  onLevelSubscribe: (level: number) => Promise<void>;
  onFullSubscribe: () => Promise<void>;
  onClose: () => void;
};
export const ReferralSubscriptionModal: FC<ReferralSubscriptionModalProps> = ({
  isOpen,
  fullSubscriptionCost,
  levelSubscriptionCost,
  subscriptionDuration,
  fullSubscriptionTill,
  levelsSubscriptionTill,
  isLoading,
  onLevelSubscribe,
  onFullSubscribe,
  onClose,
}) => {
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [levelLoading, setLevelLoading] = useState<number>();
  const logger = useLogger({
    event: 'team',
    category: 'elements',
    action: 'button_click',
    context: 'levels',
    buttonLocation: 'popup',
    actionGroup: 'conversions',
  });
  const navigate = useNavigateByHash();
  const { statusPowerA, hasActivePowerA } = useUserReferralSubscription();

  const handleSubscribeToFull = useCallback(
    async (isProlong?: boolean) => {
      logger({
        value: bigNumberToString(fullSubscriptionCost),
        content: 'all',
        label: isProlong ? 'prolong' : 'activate',
      });
      setIsFullLoading(true);
      return onFullSubscribe().finally(() => {
        setIsFullLoading(false);
      });
    },
    [setIsFullLoading, onFullSubscribe, logger, fullSubscriptionCost]
  );

  const handleSubscribeToLevel = useCallback(
    async (level: number, isProlong?: boolean) => {
      logger({
        value: bigNumberToString(levelSubscriptionCost),
        content: level,
        label: isProlong ? 'prolong' : 'activate',
      });
      setLevelLoading(level);
      return onLevelSubscribe(level).finally(() => {
        setLevelLoading(undefined);
      });
    },
    [onLevelSubscribe, setLevelLoading, logger, levelSubscriptionCost]
  );

  const openPowersInfo = useCallback(async () => {
    onClose();
    navigate('/avatar-settings#powers');
  }, [onClose, navigate]);

  const isLevelLoading = levelLoading !== undefined;

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent position="relative">
        <ModalHeader textStyle="textSansBold">
          <Text textStyle="textSansBold" fontSize={{ md: '26px' }}>
            Activation Build A Team
          </Text>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody display="flex" flexDirection="column" mr="-16px" pr="16px">
          {isLoading ? <CenteredSpinner /> : null}

          <Box mt="6px">
            <SubscriptionLevel
              title="All Levels"
              price={fullSubscriptionCost}
              duration={subscriptionDuration}
              subscriptionTill={fullSubscriptionTill}
              disabled={isLevelLoading || isFullLoading}
              isLoading={isFullLoading}
              onSubscribe={(isProlong) => handleSubscribeToFull(isProlong)}
            />
          </Box>
          <Divider mt="30px" />

          <Box overflow="auto" className="with-custom-scroll" mr="-16px" pr="16px">
            <Box>
              {levelsSubscriptionTill.map((subTill, index) => (
                <Box key={index} mt="30px">
                  <SubscriptionLevel
                    title={`${index + 1} Level`}
                    price={levelSubscriptionCost}
                    duration={subscriptionDuration}
                    subscriptionTill={subTill}
                    disabled={
                      isFullLoading ||
                      isLevelLoading ||
                      !hasActivePrevSubscription(levelsSubscriptionTill, index)
                    }
                    isLoading={levelLoading === index + 1}
                    onSubscribe={(isProlong) => handleSubscribeToLevel(index + 1, isProlong)}
                  />
                </Box>
              ))}
            </Box>

            {statusPowerA.isActive ? (
              <Box mt="30px">
                <SubscriptionLevel
                  title="11-15 Levels"
                  priceString="Power A"
                  duration={subscriptionDuration}
                  subscriptionTill={statusPowerA.power}
                  isStatusActive={hasActivePowerA.data}
                  disabled={isFullLoading || isLevelLoading}
                  onSubscribe={openPowersInfo}
                  labelAppend={
                    !hasActivePowerA.data ? (
                      <Tip text="Your Levels 11-15 will become active once you activate Levels 1-10" />
                    ) : undefined
                  }
                />
              </Box>
            ) : null}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type SubscriptionLevelProps = {
  title: string;
  price?: BigNumberish;
  priceString?: string;
  duration: number;
  subscriptionTill: number;
  isStatusActive?: boolean;
  isLoading?: boolean;
  disabled: boolean;
  labelAppend?: JSX.Element;
  onSubscribe?: (isProlong: boolean) => Promise<void>;
};
const SubscriptionLevel: FC<SubscriptionLevelProps> = ({
  price,
  priceString,
  duration,
  title,
  subscriptionTill,
  isLoading,
  isStatusActive,
  disabled,
  onSubscribe,
  labelAppend,
}) => {
  const currentTime = Date.now() / 1000;
  const isActive = subscriptionTill > currentTime;
  const isEnding =
    isActive && subscriptionTill - currentTime < REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION;

  const handleSubscribe = useCallback(
    (isProlong: boolean) => {
      onSubscribe?.(isProlong);
    },
    [onSubscribe]
  );

  return (
    <Box>
      <Flex alignItems="center" mb="10px">
        <Text textStyle="textSansBold">{title}</Text>
        {isActive ? (
          <Box
            color={isStatusActive === undefined || isStatusActive ? 'green.400' : 'gray.200'}
            width="16px"
            ml="5px"
          >
            <CheckIcon />
          </Box>
        ) : null}
        {labelAppend ? <Box ml="5px">{labelAppend}</Box> : null}
      </Flex>

      <Flex alignItems="center" justifyContent="space-between">
        <Flex
          flexDir="column"
          bgColor="bgGreen.800"
          p={{ sm: '13px 16px', md: '13px 20px' }}
          borderRadius="sm"
          mr={isActive && !isEnding ? '0px' : '10px'}
          flexGrow="1"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Text textStyle="textSansBold" textOverflow="ellipsis" whiteSpace="nowrap">
            {price ? `${getReadableAmount(price, { precision: 0 })} SAV` : priceString} /{' '}
            {getReadableDuration(duration)}
          </Text>
          {isActive ? (
            <>
              <Divider orientation="horizontal" ml="auto" mr="15px" my="10px" />
              <Text textStyle="textSansExtraSmall">
                {isEnding ? '' : 'to '}
                {getLocalDateString(subscriptionTill)}
              </Text>
            </>
          ) : null}
        </Flex>
        {!isActive && onSubscribe ? (
          <Button
            size={{ sm: 'sm', md: 'unset' }}
            height={{ sm: '100%', md: 'unset' }}
            isLoading={isLoading}
            isDisabled={disabled || isLoading}
            onClick={() => handleSubscribe(false)}
          >
            Activate
          </Button>
        ) : null}
        {isEnding && onSubscribe ? (
          <Button
            variant="outlinedWhite"
            size={{ sm: 'sm', md: 'unset' }}
            height={{ sm: '100%', md: 'unset' }}
            isLoading={isLoading}
            isDisabled={disabled || isLoading}
            onClick={() => handleSubscribe(true)}
          >
            Prolong
          </Button>
        ) : null}
      </Flex>
    </Box>
  );
};
