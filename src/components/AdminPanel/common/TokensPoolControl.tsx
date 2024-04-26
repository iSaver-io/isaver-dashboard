// eslint-disable-next-line
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import { Button } from '@/components/ui/Button/Button';
import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { useTokensPoolControl } from '@/hooks/admin/useTokensPoolControl';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { bigNumberToString } from '@/utils/number';
import alchemy from '@/modules/alchemy';

import { AddCategoryModal } from './AddCategoryModal';
import { AddPrizeToTokensPoolModal } from './AddPrizeToTokensPoolModal';
import { AddressesListControl } from './AddressesListControl';
import { RemovePrizeModal } from './RemovePrizeModal';

type TokensPoolTypes = ContractsEnum.MomentoTokensPool | ContractsEnum.BirthdayTokensPool;

export const TokensPoolControl = ({
  label,
  contractName,
}: {
  label: string;
  contractName: TokensPoolTypes;
}) => {
  const tokensPool = useTokensPoolControl(contractName);

  const {
    isOpen: isOpenAddCategory,
    onOpen: onOpenAddCategory,
    onClose: onCloseAddCategory,
  } = useDisclosure();

  return (
    <Box>
      <Flex align="flex-end" gap="20px">
        <Text fontSize="22px" fontWeight="600">
          {label}
        </Text>
        <Button size="sm" mt="8px" onClick={onOpenAddCategory}>
          Create category
        </Button>
      </Flex>

      <AddressesListControl
        addresses={tokensPool.adminsRequest.data || []}
        label="Edit admin"
        listLabel="Admins"
        addActionLabel="Grant role"
        removeActionLabel="Revoke role"
        onAdd={tokensPool.grantAdminRole.mutateAsync}
        onRemove={tokensPool.revokeAdminRole.mutateAsync}
      />

      <Text fontWeight="500" my="8px" fontSize="18px">
        Categories ({tokensPool.prizesRequest.data?.length}) (total chance:{' '}
        {tokensPool.totalChanceRequest.data?.toString()}):
      </Text>

      <Box maxHeight="1000px" overflow="auto">
        {tokensPool.prizesRequest.data
          ?.sort((a, b) => b.categoryId - a.categoryId)
          .map((category) => (
            <TokensPoolCategory
              key={`category-${category.categoryId}`}
              contractName={contractName}
              {...category}
            />
          ))}
      </Box>

      {isOpenAddCategory ? (
        <AddCategoryModal
          mode="create"
          onClose={onCloseAddCategory}
          onSubmit={tokensPool.createCategoryMutation.mutateAsync}
        />
      ) : null}
    </Box>
  );
};

type TokensPoolCategoryProps = {
  contractName: TokensPoolTypes;
  categoryId: number;
  info: { chance: BigNumber; isEmpty: boolean };
  prizes: Array<any>;
};
const TokensPoolCategory = ({
  contractName,
  categoryId,
  info,
  prizes,
}: TokensPoolCategoryProps) => {
  const {
    totalChanceRequest,
    addPrizeToCategory,
    updateCategoryMutation,
    removePrizeFromCategory,
  } = useTokensPoolControl(contractName);

  const {
    isOpen: isOpenUpdateCategory,
    onOpen: onOpenUpdateCategory,
    onClose: onCloseUpdateCategory,
  } = useDisclosure();
  const {
    isOpen: isOpenAddPrize,
    onOpen: onOpenAddPrize,
    onClose: onCloseAddPrize,
  } = useDisclosure();

  const handleUpdateCategory = useCallback(
    (chance: number) =>
      updateCategoryMutation.mutateAsync({
        categoryId,
        chance,
      }),
    [updateCategoryMutation, categoryId]
  );

  const handleAddPrizeToCategory = useCallback(
    (params: any) =>
      addPrizeToCategory.mutateAsync({
        id: categoryId,
        ...params,
      }),
    [addPrizeToCategory, categoryId]
  );

  const handleRemovePrize = useCallback(
    (prizeId: number, toAddress: string) =>
      removePrizeFromCategory.mutateAsync({
        categoryId,
        prizeId,
        toAddress,
      }),
    [removePrizeFromCategory, categoryId]
  );

  const chancePercent = useMemo(() => {
    if (info.isEmpty) return undefined;
    if (!totalChanceRequest.data || !info.chance) return undefined;
    const chance =
      Math.round((info.chance.toNumber() / totalChanceRequest.data.toNumber()) * 10000) / 100;

    return chance;
  }, [info.isEmpty, info.chance, totalChanceRequest.data]);
  const totalRemaining = useMemo(
    () => prizes.reduce((acc, prize) => acc + parseInt(prize.remaining), 0),
    [prizes]
  );
  const totalInitialRemaining = useMemo(() => {
    // hardcode for removing old Powers collection info in that category
    if (categoryId === 12 && info.chance.toString() == '400') return '400';
    return prizes.reduce((acc, prize) => acc + parseInt(prize.initialAmount), 0);
  }, [prizes, categoryId, info]);

  return (
    <Box border="1px solid gray" borderRadius="12px" padding="8px 12px" mt="8px">
      <Flex align="flex-start" justifyContent="space-between">
        <Box>
          <Flex align="baseline" gap="12px">
            <Text>Category id #{categoryId}</Text>
            {info.isEmpty ? (
              <Text color="red" textStyle="button">
                Empty
              </Text>
            ) : (
              <Text color="green" textStyle="button">
                Not empty
              </Text>
            )}
          </Flex>
          <Text>
            Chance: {info.chance.toString()} {chancePercent ? `(${chancePercent}%)` : '(empty)'}
          </Text>
          <Text>
            Total remaining: {totalRemaining} / {totalInitialRemaining}
          </Text>

          <Text>Prizes ({prizes.length}):</Text>
        </Box>

        <Flex direction="column" gap="8px">
          <Button size="sm" onClick={onOpenAddPrize}>
            Add prize
          </Button>

          <Button size="sm" onClick={onOpenUpdateCategory}>
            Update chance
          </Button>
        </Flex>
      </Flex>

      <Flex direction="column">
        {prizes
          .map((p, prizeIndex) => ({ ...p, prizeIndex }))
          .filter((p) => p.remaining > 0)
          .map((prize) => (
            <TokensPoolPrize
              key={`prize-${prize.prizeIndex}`}
              {...prize}
              prizeId={prize.prizeIndex}
              categoryId={categoryId}
              onRemove={handleRemovePrize}
            />
          ))}
      </Flex>

      {isOpenUpdateCategory ? (
        <AddCategoryModal
          mode="update"
          onClose={onCloseUpdateCategory}
          onSubmit={handleUpdateCategory}
        />
      ) : null}

      {isOpenAddPrize ? (
        <AddPrizeToTokensPoolModal onClose={onCloseAddPrize} onSubmit={handleAddPrizeToCategory} />
      ) : null}
    </Box>
  );
};

type TokensPoolPrizeProps = {
  categoryId: number;
  prizeId: number;
  tokenAddress: string;
  isERC20: boolean;
  isERC721: boolean;
  isERC1155: boolean;
  amount: BigNumber;
  remaining: BigNumber;
  initialAmount: BigNumber;
  tokenIds: string[];

  onRemove: (id: number, to: string) => Promise<void>;
};
const TokensPoolPrize = ({
  categoryId,
  prizeId,
  tokenAddress,
  isERC1155,
  isERC20,
  isERC721,
  amount,
  initialAmount,
  remaining,
  tokenIds,
  onRemove,
}: TokensPoolPrizeProps) => {
  const {
    isOpen: isOpenRemovePrize,
    onOpen: onOpenRemovePrize,
    onClose: onCloseRemovePrize,
  } = useDisclosure();
  const contractAddresses = useContractsAddresses();
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  const tokenType = isERC20 ? 'ERC20' : isERC721 ? 'ERC721' : isERC1155 ? 'ERC1155' : 'unknown';

  useEffect(() => {
    if (tokenName) return;

    if (tokenAddress === contractAddresses.ISaverSAVToken) setTokenName('SAV');
    else if (tokenAddress === contractAddresses.ISaverSAVRToken) setTokenName('SAVR');
    else if (tokenAddress === contractAddresses.ISaverAvatars) setTokenName('iSaver Avatars');
    else if (tokenAddress === contractAddresses.Ticket) setTokenName('iSaver Ticket');
    else if (tokenAddress === contractAddresses.ISaverPowers) setTokenName('iSaver Powers');
    else {
      alchemy.core.getTokenMetadata(tokenAddress).then((tokenMetadata) => {
        setTokenName('External: ' + (tokenMetadata.name || tokenMetadata.symbol));
        setTokenDecimals(tokenMetadata.decimals || 18);
      });
      setTokenName('External token');
    }
  }, [tokenName, tokenAddress, contractAddresses]);

  return (
    <Box padding="4px 8px" border="1px solid grey" borderRadius="8px" mt="4px">
      <Flex align="flex-start" justifyContent="space-between">
        <Box>
          <Text>Prize № {prizeId}</Text>
          <Text>
            Token name:{' '}
            <b>
              {tokenName} ({tokenType})
            </b>
          </Text>
          <Text>
            Amount (in 1 prize):{' '}
            <b>
              {isERC20 ? bigNumberToString(amount, { decimals: tokenDecimals }) : amount.toString()}
            </b>
          </Text>
          <Text>
            Remaining prizes:{' '}
            <b>
              {remaining.toString()} / {initialAmount.toString()}
            </b>
          </Text>
        </Box>

        <Button size="sm" bgColor="red" onClick={onOpenRemovePrize}>
          Remove
        </Button>
      </Flex>

      {isOpenRemovePrize ? (
        <RemovePrizeModal
          categoryId={categoryId}
          prizeId={prizeId}
          onClose={onCloseRemovePrize}
          onSubmit={({ toAddress }) => onRemove(prizeId, toAddress)}
        />
      ) : null}
    </Box>
  );
};
