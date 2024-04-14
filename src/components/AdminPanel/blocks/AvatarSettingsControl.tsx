import { useCallback } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { Balance } from '@/components/Balance/Balance';
import { useTokensPoolControl } from '@/hooks/admin/useTokensPoolControl';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import {
  useApprovedCollections,
  useAvatarSettingsActivePowers,
  useAvatarSettingsControl,
  useAvatarSettingsStatistic,
  usePowerActivationFee,
} from '@/hooks/useAvatarSettings';
import { POWERS_LIST } from '@/hooks/usePowers';

import { AddressesListControl } from '../common/AddressesListControl';
import { ControlField } from '../common/ControlField';
import { TokensPoolControl } from '../common/TokensPoolControl';

export const AvatarSettingsControl = () => {
  const {
    statisticRequest: { isFetched },
    activeAvatars,
    activeExternalAvatars,
    activatedPowers,
  } = useAvatarSettingsStatistic();

  const { activePowers, isLoading: isActivePowersLoading } = useAvatarSettingsActivePowers();
  const { prizesRequest } = useTokensPoolControl(ContractsEnum.BirthdayTokensPool);

  const approvedCollections = useApprovedCollections();
  const powerActivationFee = usePowerActivationFee();
  const { approveCollectionMutation, updatePowerActivationFeeMutation } =
    useAvatarSettingsControl();

  const handleApproveCollection = useCallback(
    (collectionAddress: string, isApproved: boolean) =>
      approveCollectionMutation.mutateAsync({
        collectionAddress,
        isApproved,
      }),
    [approveCollectionMutation]
  );

  return (
    <AdminSection
      title="Avatar Settings"
      isLoading={!isFetched || isActivePowersLoading || prizesRequest.isLoading}
    >
      <>
        <Balance label="Active Avatars:" balance={activeAvatars} minLimit={0} isRaw />
        <Balance
          label="Active external Avatars:"
          balance={activeExternalAvatars}
          minLimit={0}
          isRaw
        />

        {POWERS_LIST.map((power, index) => (
          <Flex textStyle="text1" fontSize="16px" mb="10px" key={index}>
            <Text mr="12px" flex="200px 0 0">
              Active Powers {power} (total):
            </Text>
            <Text color="sav">
              {activatedPowers && activatedPowers[index]
                ? `${activePowers?.[index]} (${activatedPowers[index]})`
                : '---'}
            </Text>
          </Flex>
        ))}

        <Balance label="Users with 4 Powers:" balance={activePowers?.full} minLimit={0} isRaw />

        <ControlField
          label="Power activation fee"
          value={powerActivationFee}
          onSubmit={updatePowerActivationFeeMutation.mutateAsync}
        />

        <AddressesListControl
          addresses={approvedCollections}
          label="Approve collection"
          listLabel="Approved external collections"
          addActionLabel="Approve"
          removeActionLabel="Revoke"
          onAdd={(address) => handleApproveCollection(address, true)}
          onRemove={(address) => handleApproveCollection(address, false)}
        />

        <TokensPoolControl
          label="Birthday Present Pool"
          contractName={ContractsEnum.BirthdayTokensPool}
        />
      </>
    </AdminSection>
  );
};
