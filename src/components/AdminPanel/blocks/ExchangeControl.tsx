import { ButtonGroup, Flex, Text } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { ControlField } from '@/components/AdminPanel/common/ControlField';
import { Button } from '@/components/ui/Button/Button';
import { useDashboardConfigControl } from '@/hooks/admin/useDashboardConfigControl';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';
import { useVendorSellControl } from '@/hooks/useVendorSell';

export const ExchangeControl = () => {
  const { sellCommissionRequest, sellCommission, updateSellFee } = useVendorSellControl();

  const { setIsExchangeSellEnabled } = useDashboardConfigControl();
  const { isExchangeSellEnabled } = useDashboardConfig();

  return (
    <AdminSection title="Exchange" isLoading={sellCommissionRequest.isLoading}>
      <Flex alignItems="center" mb="16px">
        <Text textStyle="text1" width="100px">
          SAV sell:
        </Text>
        {isExchangeSellEnabled ? (
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
            isDisabled={isExchangeSellEnabled}
            onClick={() => setIsExchangeSellEnabled(true)}
          >
            Enable
          </Button>
          <Button
            variant="filledRed"
            isDisabled={!isExchangeSellEnabled}
            onClick={() => setIsExchangeSellEnabled(false)}
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
