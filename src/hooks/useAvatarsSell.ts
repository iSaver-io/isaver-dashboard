import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, BigNumberish } from 'ethers';
import { useAccount } from 'wagmi';

import { bigNumberToNumber, bigNumberToString } from '@/utils/number';

import { useAvatarsSellContract } from './contracts/useAvatarsSellContract';
import { useConnectWallet } from './useConnectWallet';
import { useNotification } from './useNotification';
import { useTokens } from './useTokens';

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
      ? bigNumberToString(avatarPriceRequest.data, { decimals: 18, precision: 3 })
      : 0.0;
  }, [avatarPriceRequest.data]);

  const avatarNextPrice = useMemo(() => {
    const avatarPrice = avatarPriceRequest.data;
    const inflationRate = inflationRateRequest.data;
    const divider = dividerRequest.data;

    if (avatarPrice && inflationRate && divider) {
      const rateMultiplier = inflationRate.add(divider);

      const nextPrice = avatarPrice.mul(rateMultiplier).div(divider);
      return bigNumberToString(nextPrice, { decimals: 18, precision: 3 });
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
      queryKey: [POWER_PRICE_REQUEST, id],
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
        description: `You have successfully purchased an avatar for ${bigNumberToString(
          avatarPriceRequest.data,
          { decimals: 18 }
        )} SAV.`,
        txHash,
      });
    },
    {
      onError: (err) => {
        handleError(err);
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
      success({
        title: 'Success',
        description: `You have successfully purchased ${amount} powers for ${bigNumberToString(
          powerPrice.mul(amount),
          { decimals: 18 }
        )} SAV.`,
        txHash,
      });
    },
    {
      onError: (err) => {
        handleError(err);
      },
    }
  );
};
