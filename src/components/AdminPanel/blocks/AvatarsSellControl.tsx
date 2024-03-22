import { Box, Flex, Text } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import {
  useAvatarSellStatistic,
  useAvatarsSell,
  useAvatarsSellControl,
  usePowerPrices,
} from '@/hooks/useAvatarsSell';
import { POWERS_LIST } from '@/hooks/usePowers';
import { bigNumberToNumber } from '@/utils/number';

import { ControlField } from '../common/ControlField';

export const AvatarsSellControl = () => {
  const { basePrice, inflationRate, inflationPeriod } = useAvatarsSell();
  const powerPrices = usePowerPrices([1, 2, 3, 4]);
  const { updateBasePrice, updateInflationRate, updateInflationPeriod, updatePowerPrice } =
    useAvatarsSellControl();

  const {
    avatarsSold,
    powersSold,
    soldStatisticRequest: { isLoading },
  } = useAvatarSellStatistic();

  return (
    <AdminSection title="Avatars Sell">
      <>
        <Box mb="24px">
          {isLoading ? <CenteredSpinner /> : null}

          <Flex textStyle="text1" mb="10px">
            <Text mr="12px" flex="200px 0 0">
              Minted Avatars (SAV):
            </Text>
            <Text color="sav">
              {avatarsSold
                ? `${avatarsSold.amount} (${bigNumberToNumber(avatarsSold.cumulativeCost)})`
                : '---'}
            </Text>
          </Flex>

          {POWERS_LIST.map((power, index) => (
            <Flex textStyle="text1" mb="10px" key={index}>
              <Text mr="12px" flex="200px 0 0">
                Minted Powers {power} (SAV):
              </Text>
              <Text color="sav">
                {powersSold && powersSold[index]
                  ? `${powersSold[index].amount} (${bigNumberToNumber(
                      powersSold[index].cumulativeCost
                    )})`
                  : '---'}
              </Text>
            </Flex>
          ))}
        </Box>

        <ControlField
          label="Avatar base cost"
          value={basePrice}
          onSubmit={updateBasePrice.mutateAsync}
        />
        <ControlField
          label="Inflation rate"
          value={inflationRate}
          onSubmit={updateInflationRate.mutateAsync}
        />
        <ControlField
          label="Inflation period (hours)"
          value={inflationPeriod}
          onSubmit={updateInflationPeriod.mutateAsync}
        />
        <ControlField
          label="Cost of power A"
          value={powerPrices[1]}
          onSubmit={(price) => updatePowerPrice.mutateAsync({ id: 1, price })}
        />
        <ControlField
          label="Cost of power B"
          value={powerPrices[2]}
          onSubmit={(price) => updatePowerPrice.mutateAsync({ id: 2, price })}
        />
        <ControlField
          label="Cost of power C"
          value={powerPrices[3]}
          onSubmit={(price) => updatePowerPrice.mutateAsync({ id: 3, price })}
        />
        <ControlField
          label="Cost of power D"
          value={powerPrices[4]}
          onSubmit={(price) => updatePowerPrice.mutateAsync({ id: 4, price })}
        />
      </>
    </AdminSection>
  );
};
