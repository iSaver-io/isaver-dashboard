import { Flex, Text } from '@chakra-ui/react';

import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as SavRIcon } from '@/assets/images/savr_icon.svg';
import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { ControlField } from '@/components/AdminPanel/common/ControlField';
import { useTokenControl } from '@/hooks/admin/useTokenControl';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';

export const TokensControl = () => {
  const { addToWhiteList, removeFromWhiteList } = useTokenControl(ContractsEnum.SAVR);

  return (
    <AdminSection title={'Tokens'}>
      <>
        <Flex align="center" mb="8px">
          <SavIcon width="32px" />
          <Text mx="12px" fontWeight="600">
            SAV Token
          </Text>

          <Text textStyle="button" color={'green.400'}>
            Active
          </Text>
        </Flex>

        <Flex align="center" mb="8px">
          <SavRIcon width="32px" />
          <Text mx="12px" fontWeight="600">
            SAVR Token
          </Text>

          <Text textStyle="button" color={'green.400'}>
            Active
          </Text>

          <Text ml="12px" textStyle="button" color="green.400">
            WhiteList
          </Text>
        </Flex>

        <ControlField
          label="Add to whitelist"
          onSubmit={addToWhiteList.mutateAsync}
          tip="Split addresses with comma"
        />
        <ControlField
          label="Remove from whitelist"
          onSubmit={removeFromWhiteList.mutateAsync}
          tip="Split addresses with comma"
        />
      </>
    </AdminSection>
  );
};
