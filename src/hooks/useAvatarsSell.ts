import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useAccount } from 'wagmi';

import { bigNumberToNumber } from '@/utils/number';

import { useAvatarsSellContract } from './contracts/useAvatarsSellContract';
import { useConnectWallet } from './useConnectWallet';
import { useNotification } from './useNotification';
import { useTokens } from './useTokens';

const BASE_PRICE_REQUEST = 'base-price-request';
const AVATAR_PRICE_REQUEST = 'avatar-price-request';
const POWER_PRICE_REQUEST = 'power-price-request';
const DIVIDER_REQUEST = 'divider-request';
const INFLATION_RATE_REQUEST = 'inflation-rate-request';
const INFLATION_PERIOD_REQUEST = 'inflation-period-request';
const BASE_TIMESTAMP_REQUEST = 'base-timestamp-request';
const BUY_AVATAR_MUTATION = 'buy-avatar-mutation';
const BUY_POWERS_MUTATION = 'buy-powers-mutation';

export const useAvatarPrices = () => {
  const avatarsSellContract = useAvatarsSellContract();

  const queryOptions = {
    staleTime: 0,
    cacheTime: 0,
  };

  const avatarPriceRequest = useQuery(
    [AVATAR_PRICE_REQUEST],
    async () => await avatarsSellContract.getAvatarPrice(),
    queryOptions
  );

  const dividerRequest = useQuery(
    [DIVIDER_REQUEST],
    async () => await avatarsSellContract.getDivider(),
    queryOptions
  );

  const inflationRateRequest = useQuery(
    [INFLATION_RATE_REQUEST],
    async () => await avatarsSellContract.getInflationRate(),
    queryOptions
  );

  const avatarPrice = useMemo(() => {
    return avatarPriceRequest.data
      ? Math.ceil(
          bigNumberToNumber(avatarPriceRequest.data, { decimals: 18, precision: 3 }) * 100
        ) / 100
      : 0;
  }, [avatarPriceRequest.data]);

  const avatarNextPrice = useMemo(() => {
    const avatarPrice = avatarPriceRequest.data;
    const inflationRate = inflationRateRequest.data;
    const divider = dividerRequest.data;

    if (avatarPrice && inflationRate && divider) {
      const rateMultiplier = inflationRate.add(divider);

      const nextPrice = avatarPrice.mul(rateMultiplier).div(divider);
      const nextPriceNumber = bigNumberToNumber(nextPrice, { decimals: 18, precision: 3 });
      // Округляем вверх сотые
      return Math.ceil(nextPriceNumber * 100) / 100;
    }

    return null;
  }, [avatarPriceRequest.data, inflationRateRequest.data, dividerRequest.data]);

  return { avatarPrice, avatarNextPrice };
};

export const usePowerPrices = (ids: number[]) => {
  const avatarsSellContract = useAvatarsSellContract();
  const [prices, setPrices] = useState<Record<number, number>>({});

  useQueries({
    queries: ids.map((id) => ({
      queryKey: [POWER_PRICE_REQUEST, { id }],
      queryFn: async () => {
        const price = await avatarsSellContract.getPowerPrice(id);
        return bigNumberToNumber(price, { decimals: 18 });
      },
      onSuccess: (price: number) => {
        setPrices((prevPrices) => ({ ...prevPrices, [id]: price }));
      },
    })),
  });

  return prices;
};

export const useNextInflationTimestamp = () => {
  const avatarsSellContract = useAvatarsSellContract();
  const queryClient = useQueryClient();

  const queryOptions = {
    staleTime: 0,
    cacheTime: 0,
  };

  const inflationPeriodRequest = useQuery(
    [INFLATION_PERIOD_REQUEST],
    async () => await avatarsSellContract.getInflationPeriod(),
    queryOptions
  );

  const baseTimestampRequest = useQuery([BASE_TIMESTAMP_REQUEST], async () => {
    return await avatarsSellContract.getBaseTimestamp();
  });

  const nextInflationTimestamp = useMemo(() => {
    const baseTimestamp = baseTimestampRequest.data ? baseTimestampRequest.data.toNumber() : null;
    const inflationPeriod = inflationPeriodRequest.data
      ? inflationPeriodRequest.data.toNumber()
      : null;

    if (baseTimestamp && inflationPeriod) {
      const currentTime = Math.floor(Date.now() / 1000);
      const periodsElapsed = Math.floor((currentTime - baseTimestamp) / inflationPeriod);
      return (baseTimestamp + (periodsElapsed + 1) * inflationPeriod) * 1000;
    }
    return null;
  }, [inflationPeriodRequest.data, baseTimestampRequest.data]);

  useEffect(() => {
    if (nextInflationTimestamp) {
      const interval = nextInflationTimestamp - Date.now();
      if (interval > 0) {
        const timeoutId = setTimeout(() => {
          queryClient.refetchQueries([AVATAR_PRICE_REQUEST]);
          queryClient.refetchQueries([INFLATION_RATE_REQUEST]);
          queryClient.refetchQueries([INFLATION_PERIOD_REQUEST]);
        }, interval);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [nextInflationTimestamp, queryClient]);

  return nextInflationTimestamp;
};

export const useBuyAvatar = () => {
  const avatarsSellContract = useAvatarsSellContract();
  const { savToken } = useTokens();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();

  const avatarPriceRequest = useQuery(
    [AVATAR_PRICE_REQUEST],
    async () => await avatarsSellContract.getAvatarPrice()
  );

  return useMutation(
    [BUY_AVATAR_MUTATION],
    async () => {
      if (!account) {
        connect();
        return;
      }

      if (!avatarPriceRequest.data) {
        return;
      }

      const allowance = await savToken.allowance(account, avatarsSellContract.address);

      if (allowance.lt(avatarPriceRequest.data)) {
        const txHash = await savToken.approve(
          avatarsSellContract.address,
          BigNumber.from(avatarPriceRequest.data)
        );
        success({ title: 'Approved', txHash });
      }

      const txHash = await avatarsSellContract.buyAvatar();
      success({
        title: 'Success',
        description: 'You have minted the Avatar',
        txHash,
      });
    },
    {
      onError: (err) => {
        handleError(err, 'avatars');
      },
    }
  );
};

export const useBuyPowers = () => {
  const avatarsSellContract = useAvatarsSellContract();
  const { savToken } = useTokens();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();

  return useMutation(
    [BUY_POWERS_MUTATION],
    async ({ id, amount }: { id: BigNumberish; amount: BigNumberish }) => {
      if (!account) {
        connect();
        return;
      }

      const allowance = await savToken.allowance(account, avatarsSellContract.address);
      const powerPrice = await avatarsSellContract.getPowerPrice(id);

      if (allowance.lt(powerPrice)) {
        const txHash = await savToken.approve(
          avatarsSellContract.address,
          BigNumber.from(powerPrice.mul(amount))
        );
        success({ title: 'Approved', txHash });
      }

      const txHash = await avatarsSellContract.buyPower(id, amount);

      const idStr = id.toString();
      const powerTypeMap: Record<string, string> = {
        '1': 'A',
        '2': 'B',
        '3': 'C',
        '4': 'D',
      };
      const powerType = Object.keys(powerTypeMap).includes(idStr) ? powerTypeMap[idStr] : '';
      success({
        title: 'Success',
        description: `You have minted ${amount} Powers ${powerType}`,
        txHash,
      });
    },
    {
      onError: (err) => {
        handleError(err, 'powers');
      },
    }
  );
};

export const useAvatarsSell = () => {
  const avatarsSellContract = useAvatarsSellContract();

  const basePriceRequest = useQuery(
    [BASE_PRICE_REQUEST],
    async () => await avatarsSellContract.getBasePrice()
  );

  const inflationPeriodRequest = useQuery(
    [INFLATION_PERIOD_REQUEST],
    async () => await avatarsSellContract.getInflationPeriod()
  );

  const inflationRateRequest = useQuery(
    [INFLATION_RATE_REQUEST],
    async () => await avatarsSellContract.getInflationRate()
  );

  return {
    basePrice: basePriceRequest.data ? bigNumberToNumber(basePriceRequest.data) : null,
    inflationPeriod: inflationPeriodRequest.data
      ? inflationPeriodRequest.data.toNumber() / 60 / 60
      : null,
    inflationRate: inflationRateRequest.data ? inflationRateRequest.data.toNumber() : null,
  };
};

export const AVATARS_SELL_SOLD_STATISTIC_REQUEST = 'avatars-sell-sold-statistic-request';
export const useAvatarSellStatistic = () => {
  const avatarsSellContract = useAvatarsSellContract();

  const soldStatisticRequest = useQuery(
    [AVATARS_SELL_SOLD_STATISTIC_REQUEST],
    async () => await avatarsSellContract.getSoldStatistic()
  );

  const avatarsSold = useMemo(() => soldStatisticRequest.data?.[0], [soldStatisticRequest.data]);
  const powersSold = useMemo(() => soldStatisticRequest.data?.[1], [soldStatisticRequest.data]);

  return { soldStatisticRequest, avatarsSold, powersSold };
};

export const useAvatarsSellControl = () => {
  const avatarsSellContract = useAvatarsSellContract();
  const queryClient = useQueryClient();
  const { success, handleError } = useNotification();

  const updateBasePrice = useMutation(
    ['update-base-price'],
    async (price: string) => {
      const priceInWei = ethers.utils.parseEther(price);
      const txHash = await avatarsSellContract.updateBasePrice(priceInWei);
      success({ title: 'Success', description: 'Base Price updated', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([BASE_PRICE_REQUEST, AVATAR_PRICE_REQUEST]);
      },
      onError: (err) => handleError(err),
    }
  );

  const updateInflationRate = useMutation(
    ['update-inflation-rate'],
    async (rate: number) => {
      const txHash = await avatarsSellContract.updateInflationRate(rate);
      success({ title: 'Success', description: 'Rate updated', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([INFLATION_RATE_REQUEST]);
      },
      onError: (err) => handleError(err),
    }
  );

  const updateInflationPeriod = useMutation(
    ['update-inflation-period'],
    async (period: number) => {
      const txHash = await avatarsSellContract.updateInflationPeriod(period * 60 * 60);
      success({ title: 'Success', description: 'Period updated', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([INFLATION_PERIOD_REQUEST]);
      },
      onError: (err) => handleError(err),
    }
  );

  const updatePowerPrice = useMutation(
    ['update-power-price'],
    async ({ id, price }: { id: number; price: string }) => {
      const priceInWei = ethers.utils.parseEther(price);
      const txHash = await avatarsSellContract.updatePowerPrice(id, priceInWei);
      success({ title: 'Success', description: `Price for power ${id} updated`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([POWER_PRICE_REQUEST]);
      },
      onError: (err) => handleError(err),
    }
  );
  return {
    updateBasePrice,
    updateInflationRate,
    updateInflationPeriod,
    updatePowerPrice,
  };
};
