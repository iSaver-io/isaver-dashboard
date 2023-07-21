import { FC } from 'react';
import { ButtonGroup, Flex, Text } from '@chakra-ui/react';

import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as SavRIcon } from '@/assets/images/savr_icon.svg';
import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { ControlField } from '@/components/AdminPanel/common/ControlField';
import { Button } from '@/components/ui/Button/Button';
import { useTokenControl } from '@/hooks/admin/useTokenControl';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';

type TokenControlProps = {
  token: ContractsEnum.SAV | ContractsEnum.SAVR;
};
export const TokenControl: FC<TokenControlProps> = ({ token }) => {
  const {
    isPaused,
    isWhitelistRestrictionMode,
    pause,
    unpause,
    addToBlacklist,
    addToWhitelist,
    removeFromBlacklist,
    removeFromWhitelist,
    enableWhitelistMode,
    disableWhitelistMode,
  } = useTokenControl(token);

  const isSav = token === ContractsEnum.SAV;

  const title = (
    <Flex align="center">
      {isSav ? <SavIcon width="32px" /> : <SavRIcon width="32px" />}
      <Text mx="12px">{isSav ? 'SAV Token' : 'SAVR Token'}</Text>
      {isPaused.isFetched ? (
        <Text textStyle="button" color={isPaused.data ? 'red' : 'green.400'}>
          {isPaused.data ? 'Paused' : 'Active'}
        </Text>
      ) : null}
      {isWhitelistRestrictionMode.isFetched ? (
        <Text
          ml="12px"
          textStyle="button"
          color={isWhitelistRestrictionMode.data ? 'red' : 'green.400'}
        >
          {isWhitelistRestrictionMode.data ? 'Whitelist' : 'Blacklist'}
        </Text>
      ) : null}
    </Flex>
  );

  return (
    <AdminSection title={title} isLoading={isPaused.isLoading}>
      <ButtonGroup size="sm" my="12px" display="block">
        <Button
          borderRadius="sm"
          isDisabled={!isPaused.data || unpause.isLoading || isPaused.isLoading}
          isLoading={unpause.isLoading}
          onClick={() => unpause.mutate()}
        >
          Unpause
        </Button>
        <Button
          variant="filledRed"
          isDisabled={isPaused.data || pause.isLoading || isPaused.isLoading}
          isLoading={pause.isLoading}
          onClick={() => pause.mutate()}
        >
          Pause
        </Button>
      </ButtonGroup>

      <ButtonGroup size="sm" mb="12px">
        <Button
          borderRadius="sm"
          isDisabled={
            !isWhitelistRestrictionMode.data ||
            disableWhitelistMode.isLoading ||
            isWhitelistRestrictionMode.isLoading
          }
          isLoading={disableWhitelistMode.isLoading}
          onClick={() => disableWhitelistMode.mutate()}
        >
          Blacklist only
        </Button>
        <Button
          variant="filledRed"
          isDisabled={
            isWhitelistRestrictionMode.data ||
            enableWhitelistMode.isLoading ||
            isWhitelistRestrictionMode.isLoading
          }
          isLoading={enableWhitelistMode.isLoading}
          onClick={() => enableWhitelistMode.mutate()}
        >
          Enable Whitelist
        </Button>
      </ButtonGroup>

      <ControlField
        label="Add to blacklist"
        onSubmit={addToBlacklist.mutateAsync}
        tip="Split addresses with comma"
      />
      <ControlField
        label="Remove from blacklist"
        onSubmit={removeFromBlacklist.mutateAsync}
        tip="Split addresses with comma"
      />
      <ControlField
        label="Add to whitelist"
        onSubmit={addToWhitelist.mutateAsync}
        tip="Split addresses with comma"
      />
      <ControlField
        label="Remove from whitelist"
        onSubmit={removeFromWhitelist.mutateAsync}
        tip="Split addresses with comma"
      />
    </AdminSection>
  );
};
