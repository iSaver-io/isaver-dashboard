import { FC, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button as ChButton,
  Checkbox,
  CloseButton,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { BigNumberish, ethers } from 'ethers';
import { useAccount } from 'wagmi';

import { ReactComponent as ChevronDownIcon } from '@/assets/images/icons/chevron-down.svg';
import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as SavrIcon } from '@/assets/images/savr_icon.svg';
import { Button } from '@/components/ui/Button/Button';
import { InputAmount } from '@/components/ui/InputAmount/InputAmount';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useDebounce } from '@/hooks/useDebounce';
import { useLogger } from '@/hooks/useLogger';
import { useSavBalance, useSavRBalance } from '@/hooks/useTokenBalance';
import { bigNumberToString } from '@/utils/number';
import { calculateStakeProfitByAPR } from '@/utils/staking';
import { getReadableDuration } from '@/utils/time';

const MIN_STAKE_LIMIT = 0.1;

const boxCommonStyles = {
  bgColor: 'gray.200',
  borderRadius: 'sm',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 20px',
  textStyle: 'textSansBold',
};

type StakingModalProps = {
  tokens?: TOKENS[];
  lockPeriodDays?: BigNumberish;
  apr: number | string;
  highlightApr?: boolean;
  isLoading?: boolean;
  isPageView?: boolean;
  onStake: (token: TOKENS, amount: number) => void;
  onClose: () => void;
};
export const StakingModal: FC<StakingModalProps> = ({
  tokens = [TOKENS.SAV, TOKENS.SAVR],
  lockPeriodDays,
  isLoading,
  isPageView,
  highlightApr,
  apr,
  onStake,
  onClose,
}) => {
  const [token, setToken] = useState<TOKENS>(tokens[0]);
  const [amount, setAmount] = useState<string>();
  const [isAgreed, setIsAgreed] = useState(false);
  const { address } = useAccount();
  const { data: savBalance } = useSavBalance(address);
  const { data: savrBalance } = useSavRBalance(address);
  const logger = useLogger({
    event: 'cross',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'popup',
    actionGroup: 'interactions',
  });
  const debouncedLogger = useDebounce(logger);

  const balance = token === TOKENS.SAV ? savBalance : savrBalance;

  const handleAmountChange = useCallback(
    (value?: string) => {
      setAmount(value);

      debouncedLogger({
        event: isPageView ? 'staking' : 'dashboard',
        category: 'forms',
        action: 'form_add',
        label: 'amount',
        value,
        content: token === TOKENS.SAV ? 'sav' : 'savr',
        context: 'staking',
      });
    },
    [debouncedLogger, isPageView, token]
  );

  const handleAmountChangeTotal = useCallback(() => {
    logger({ label: 'max' });
    setAmount(bigNumberToString(balance || 0));
  }, [balance, logger]);

  const handleSetIsAgree = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      logger({ label: 'agree' });
      setIsAgreed(e.target.checked);
    },
    [logger]
  );

  const handleTokenChange = (token: TOKENS) => {
    setToken(token);
    setAmount('');
  };

  const handleStake = useCallback(() => {
    if (amount && parseFloat(amount) >= MIN_STAKE_LIMIT) {
      onStake(token, parseFloat(amount));

      logger({
        event: isPageView ? 'staking' : 'dashboard',
        category: 'forms',
        action: 'button_click',
        label: 'stake_funds',
        value: amount,
        content: token === TOKENS.SAV ? 'sav' : 'savr',
        actionGroup: 'conversions',
      });
    }
  }, [token, amount, onStake, logger, isPageView]);

  const amountBN = ethers.utils.parseEther(`${amount || 0}`);
  const isGreaterThanMax = balance?.lt(amountBN);
  const isStakeDisabled =
    !amount || parseFloat(amount) < MIN_STAKE_LIMIT || isGreaterThanMax || !isAgreed;

  const rewards = useMemo(
    () =>
      !isGreaterThanMax && lockPeriodDays
        ? calculateStakeProfitByAPR({
            amount: amount || 0,
            periodDays: lockPeriodDays,
            apr,
          })
        : 0,
    [isGreaterThanMax, amount, lockPeriodDays, apr]
  );

  return (
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          <Menu variant="dark-transparent">
            <MenuButton
              as={ChButton}
              variant="transparent"
              rightIcon={tokens.length > 1 ? <ChevronDownIcon /> : undefined}
              padding={0}
              textStyle="textBold"
              fontSize={26}
              _hover={{ cursor: tokens.length < 2 ? 'default' : 'pointer' }}
            >
              <Flex alignItems="center">
                <Box width="40px">{token === TOKENS.SAV ? <SavIcon /> : <SavrIcon />}</Box>
                <span>
                  Stake <span>{token === TOKENS.SAV ? 'SAV' : 'SAVR'}</span>
                </span>
              </Flex>
            </MenuButton>
            {tokens.length > 1 ? (
              <MenuList>
                {tokens.map((token) => (
                  <MenuItem onClick={() => handleTokenChange(token)} key={token}>
                    <Box mr="4px">
                      {token == TOKENS.SAV ? <SavIcon width="24px" /> : <SavrIcon width="24px" />}
                    </Box>
                    <span>Stake {token == TOKENS.SAV ? 'SAV' : 'SAVR'}</span>
                  </MenuItem>
                ))}
              </MenuList>
            ) : null}
          </Menu>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Box mb={5}>
            <InputAmount
              placeholder={`Min ${MIN_STAKE_LIMIT}`}
              total={balance ? bigNumberToString(balance) : undefined}
              onSetTotal={handleAmountChangeTotal}
              onChange={handleAmountChange}
              value={amount}
            />
          </Box>

          {lockPeriodDays ? (
            <Box {...boxCommonStyles} mb={5}>
              Locking period
              <Spacer />
              {getReadableDuration(lockPeriodDays)}
            </Box>
          ) : null}
          <Box {...boxCommonStyles} mb={5} color={highlightApr ? 'green.100' : 'white'}>
            {lockPeriodDays ? 'APR' : 'APY'}
            <Spacer />
            {apr}%
          </Box>
          {lockPeriodDays ? (
            <Box {...boxCommonStyles} mb={10}>
              Your rewards {!lockPeriodDays ? '(1 year)' : ''}
              <Spacer />
              <>
                {bigNumberToString(rewards)} {lockPeriodDays ? 'SAV' : 'SAVR'}
              </>
            </Box>
          ) : null}

          <Box {...boxCommonStyles} p={5}>
            <Checkbox
              isChecked={isAgreed}
              borderColor="bgGreen.200"
              colorScheme="green"
              onChange={handleSetIsAgree}
            >
              <Text fontSize="18px" ml={2}>
                I have read, understand, and agree to the{' '}
                <Link
                  color="yellow.200"
                  onClick={() =>
                    window.open('https://isaver.gitbook.io/isaver/products/staking', '_blank')
                  }
                >
                  Terms of Service
                </Link>
              </Text>
            </Checkbox>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleStake}
            isDisabled={isStakeDisabled || isLoading}
            isLoading={isLoading}
          >
            Stake funds
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
