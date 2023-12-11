import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { useAvatarsSell, useAvatarsSellControl, usePowerPrices } from '@/hooks/useAvatarsSell';

import { ControlField } from '../common/ControlField';

export const AvatarsSellControl = () => {
  const { basePrice, inflationRate, inflationPeriod } = useAvatarsSell();
  const powerPrices = usePowerPrices([1, 2, 3, 4]);
  const { updateBasePrice, updateInflationRate, updateInflationPeriod, updatePowerPrice } =
    useAvatarsSellControl();

  return (
    <AdminSection title="AvatarsSell">
      <>
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
