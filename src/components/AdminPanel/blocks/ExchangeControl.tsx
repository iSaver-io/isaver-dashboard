import { ButtonGroup, Flex, Text } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { ControlField } from '@/components/AdminPanel/common/ControlField';
import { Button } from '@/components/ui/Button/Button';
import { useVendorSellControl } from '@/hooks/useVendorSell';

export const ExchangeControl = () => {
  const {
    isSellAvailableRequest,
    sellCommissionRequest,
    sellCommission,
    enableSell,
    disableSell,
    updateSellFee,
  } = useVendorSellControl();

  return (
    <AdminSection
      title="Exchange"
      isLoading={isSellAvailableRequest.isLoading || sellCommissionRequest.isLoading}
    >
      <Flex alignItems="center" mb="16px">
        <Text textStyle="text1" width="100px">
          SAV sell:
        </Text>
        {isSellAvailableRequest.data ? (
          <Text textStyle="button" color="green.400">
            Enabled
          </Text>
        ) : (
          <Text textStyle="button" color="red">
            Disabled
          </Text>
        )}

        <ButtonGroup size="sm" ml="24px">
          <Button
            borderRadius="sm"
            isDisabled={
              isSellAvailableRequest.data ||
              isSellAvailableRequest.isLoading ||
              enableSell.isLoading
            }
            isLoading={enableSell.isLoading}
            onClick={() => enableSell.mutate()}
          >
            Enable
          </Button>
          <Button
            variant="filledRed"
            isDisabled={
              !isSellAvailableRequest.data ||
              isSellAvailableRequest.isLoading ||
              disableSell.isLoading
            }
            isLoading={disableSell.isLoading}
            onClick={() => disableSell.mutate()}
          >
            Disable
          </Button>
        </ButtonGroup>
      </Flex>
      <ControlField
        labelWidth="100px"
        label="SAV sell fee"
        value={sellCommission ? sellCommission * 100 : null}
        onSubmit={updateSellFee.mutateAsync}
      />
    </AdminSection>
  );
};
