import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Checkbox,
  CloseButton,
  Flex,
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
import { isAddress } from 'ethers/lib/utils.js';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/Button/Button';
import { InputAmount } from '@/components/ui/InputAmount/InputAmount';
import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { AddPrizeParamsType } from '@/hooks/contracts/useTokensPoolContract';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenDecimals } from '@/hooks/useTokens';
import { bigNumberToString } from '@/utils/number';

export const AddPrizeToTokensPoolModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (params: Omit<AddPrizeParamsType, 'from' | 'id'>) => Promise<any>;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [tokenType, setTokenType] = useState<'erc20' | 'erc721' | 'erc1155' | undefined>();
  const [amount, setAmount] = useState<string>('');
  const [remaining, setRemaining] = useState<number>(0);
  const [tokenIds, setTokenIds] = useState<string>('');

  const contractAddresses = useContractsAddresses();

  const isValidAddress = isAddress(tokenAddress);
  const { address } = useAccount();

  const { data: decimals } = useTokenDecimals(tokenType === 'erc20' ? tokenAddress : undefined);
  const { data: balance } = useTokenBalance(
    tokenType === 'erc20' ? tokenAddress : undefined,
    address
  );

  useEffect(() => {
    if (
      [contractAddresses.ISaverSAVToken, contractAddresses.ISaverSAVRToken].includes(tokenAddress)
    ) {
      setTokenType('erc20');
    }
    if ([contractAddresses.ISaverAvatars].includes(tokenAddress)) {
      setTokenType('erc721');
    }
    if ([contractAddresses.Ticket, contractAddresses.ISaverPowers].includes(tokenAddress)) {
      setTokenType('erc1155');
    }
  }, [tokenAddress, contractAddresses]);

  const isValid = useMemo(() => {
    if (!isAddress(tokenAddress) || !tokenType) return false;
    if (['erc20', 'erc1155'].includes(tokenType) && (!amount || !remaining)) return false;

    const tokenIdsLength = tokenIds
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean).length;
    if (tokenType === 'erc1155' && tokenIdsLength !== 1) return false;

    return true;
  }, [tokenAddress, tokenType, tokenIds, amount, remaining]);

  const handleSubmit = useCallback(() => {
    if (isValid) {
      const parsedTokenIds = tokenIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      setIsLoading(true);
      onSubmit({
        tokenAddress,
        isErc20: tokenType === 'erc20',
        isErc721: tokenType === 'erc721',
        isErc1155: tokenType === 'erc1155',
        amount: BigNumber.from(tokenType !== 'erc721' ? amount : 1),
        remaining: tokenType !== 'erc721' ? remaining : 1,
        tokenIds: parsedTokenIds,
      })
        .then(() => onClose())
        .finally(() => setIsLoading(false));
    }
  }, [isValid, onClose, onSubmit, tokenAddress, tokenType, amount, remaining, tokenIds]);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          <Text textStyle="h2">Add prize</Text>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Text mb="24px"></Text>
          <Input
            type="string"
            color={tokenAddress && !isValidAddress ? 'red' : 'inherit'}
            placeholder="Token address"
            value={tokenAddress}
            textOverflow="ellipsis"
            onChange={(e) => setTokenAddress(e.target.value.trim())}
          />

          <Flex direction="column" gap="8px" mt="16px">
            <Checkbox
              isChecked={tokenType === 'erc20'}
              colorScheme="green"
              onChange={() =>
                setTokenType((current) => (current !== 'erc20' ? 'erc20' : undefined))
              }
            >
              <Text fontSize="18px" ml={2}>
                ERC20
              </Text>
            </Checkbox>
            <Checkbox
              isChecked={tokenType === 'erc721'}
              colorScheme="green"
              onChange={() =>
                setTokenType((current) => (current !== 'erc721' ? 'erc721' : undefined))
              }
            >
              <Text fontSize="18px" ml={2}>
                ERC721
              </Text>
            </Checkbox>
            <Checkbox
              isChecked={tokenType === 'erc1155'}
              colorScheme="green"
              onChange={() =>
                setTokenType((current) => (current !== 'erc1155' ? 'erc1155' : undefined))
              }
            >
              <Text fontSize="18px" ml={2}>
                ERC1155
              </Text>
            </Checkbox>
          </Flex>

          {tokenType === 'erc20' ? (
            <Box mt="16px">
              <Text>Decimals: {decimals || '-'}</Text>
              <Text mt="8px">
                Balance: {balance ? bigNumberToString(balance, { decimals }) : '-'}
              </Text>
            </Box>
          ) : null}

          {tokenType && tokenType !== 'erc20' ? (
            <Box mt="16px">
              {tokenType === 'erc721' ? (
                <Text mb="8px" fontSize="14px">
                  Token IDs (split with comma). By default: all owned
                </Text>
              ) : null}
              <Input
                type="string"
                placeholder={tokenType === 'erc721' ? 'Token IDs ' : 'Token ID'}
                isDisabled={!['erc721', 'erc1155'].includes(tokenType || '')}
                value={tokenIds}
                textOverflow="ellipsis"
                onChange={(e) => setTokenIds(e.target.value)}
              />
            </Box>
          ) : null}

          {tokenType && tokenType !== 'erc721' ? (
            <Box mt="16px">
              <InputAmount
                placeholder="Amount of tokens to transfer in 1 prize"
                onChange={(val) => setAmount(val || '')}
                value={amount}
              />

              <InputAmount
                placeholder="Amount of prizes"
                onChange={(val) => setRemaining(parseInt(val || ''))}
                value={remaining}
              />
            </Box>
          ) : null}
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleSubmit}
            isDisabled={isLoading || !isValid}
            isLoading={isLoading}
          >
            Add prizes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
