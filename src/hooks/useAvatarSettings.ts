import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { Address, erc721ABI, useAccount, useMutation, useProvider, useSigner } from 'wagmi';
import { getContract } from 'wagmi/actions';

import { POWER_SUBSCRIPTION_ENDING_NOTIFICATION } from '@/components/AvatarSettings/PowerCard';
import { bigNumberToString, makeBigNumber } from '@/utils/number';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { useAvatarSettingsContract } from './contracts/useAvatarSettingsContract';
import { ContractsEnum, useContractAbi } from './contracts/useContractAbi';
import { usePowersContract } from './contracts/usePowersContract';
import { useConnectWallet } from './useConnectWallet';
import { GET_NFT, useAllowedNFTsForOwner } from './useNFTHolders';
import { useNotification } from './useNotification';
import { GET_POWER_BALANCE } from './usePowers';
import { useTokens } from './useTokens';

export const GET_APPROVED_COLLECTIONS = 'get-approved-collections';
export const useApprovedCollections = () => {
  const { getApprovedCollections } = useAvatarSettingsContract();
  const { address } = useAccount();

  const { data: approvedCollections } = useQuery<Address[]>(
    [GET_APPROVED_COLLECTIONS, { address }],
    async () => await getApprovedCollections()
  );

  return approvedCollections || [];
};

const AVATAR_SETTINGS_STATISTIC_REQUEST = 'avatar-settings-statistic-request';
export const useAvatarSettingsStatistic = () => {
  const contract = useAvatarSettingsContract();

  const statisticRequest = useQuery([AVATAR_SETTINGS_STATISTIC_REQUEST], () =>
    contract.getStatistic()
  );

  const activeAvatars = useMemo(() => statisticRequest.data?.[0], [statisticRequest.data]);
  const activeExternalAvatars = useMemo(() => statisticRequest.data?.[1], [statisticRequest.data]);
  const activatedPowers = useMemo(() => statisticRequest.data?.[2], [statisticRequest.data]);

  return { statisticRequest, activatedPowers, activeAvatars, activeExternalAvatars };
};

const AVATAR_SETTINGS_ACTIVATE_POWER_EVENTS_REQUEST =
  'avatar-setting-activate-power-events-request';
const AVATAR_SETTINGS_DEACTIVATE_AVATAR_EVENTS_REQUEST =
  'avatar-setting-deactivate-avatar-events-request';
export const useAvatarSettingsActivePowers = () => {
  const contract = useAvatarSettingsContract();

  const activatePowerEvents = useQuery([AVATAR_SETTINGS_ACTIVATE_POWER_EVENTS_REQUEST], () =>
    contract.getActivatePowerEvents()
  );
  const deactivateAvatarEvents = useQuery([AVATAR_SETTINGS_DEACTIVATE_AVATAR_EVENTS_REQUEST], () =>
    contract.getDeactivateAvatarEvents()
  );

  const data = useMemo(() => {
    if (deactivateAvatarEvents.data === undefined || activatePowerEvents.data === undefined) {
      return undefined;
    }

    const events = [...activatePowerEvents.data, ...deactivateAvatarEvents.data].sort(
      (a, b) => a.blockNumber - b.blockNumber
    );

    const now = Date.now();
    const usersData = events.reduce((acc, event) => {
      if (event.name === 'PowerActivated') {
        const user = event.args[0];
        const powerId = event.args[1].toNumber();
        const activeUntil = event.args[2].toNumber();

        if (!(user in acc)) {
          acc[user] = { 0: undefined, 1: undefined, 2: undefined, 3: undefined };
        }

        // Устанавливаем только если подписка еще активна
        if (activeUntil > now) {
          acc[user][powerId] = activeUntil;
        }
      } else {
        const user = event.args[0];

        acc[user] = { 0: undefined, 1: undefined, 2: undefined, 3: undefined };
      }

      return acc;
    }, {} as Record<string, Record<number, number | undefined>>);

    const activePowersCounter = Object.values(usersData).reduce(
      (acc: Record<number | string, number>, user) => {
        if (user[0]) acc[0] += 1;
        if (user[1]) acc[1] += 1;
        if (user[2]) acc[2] += 1;
        if (user[3]) acc[3] += 1;

        if (user[0] && user[1] && user[2] && user[3]) {
          acc.full += 1;
        }

        return acc;
      },
      { 0: 0, 1: 0, 2: 0, 3: 0, full: 0 } as Record<number | string, number>
    );

    return { users: usersData, activePowers: activePowersCounter };
  }, [activatePowerEvents.data, deactivateAvatarEvents.data]);

  return {
    isLoading: activatePowerEvents.isLoading || deactivateAvatarEvents.isLoading,
    users: data?.users,
    activePowers: data?.activePowers,
  };
};

export const GET_USER_POWERS = 'get-user-powers';
export const useUserPowers = (powerId: number) => {
  const { getUserPower } = useAvatarSettingsContract();
  const { address } = useAccount();

  const { data: userPowers } = useQuery([GET_USER_POWERS, { powerId, address }], async () =>
    address ? await getUserPower(address, powerId) : null
  );

  const power = (userPowers || BigNumber.from(0)).toNumber();
  const currentTime = Date.now() / 1000;
  const isActive = power > currentTime;
  const isEnding = isActive && power - currentTime < POWER_SUBSCRIPTION_ENDING_NOTIFICATION;

  return { power, isActive, isEnding };
};

export const GET_POWER_ACTIVATION_FEE = 'get-power-activation-fee';
export const usePowerActivationFee = () => {
  const { getPowerActivationFee } = useAvatarSettingsContract();
  const { address } = useAccount();

  const { data: powerActivationFee } = useQuery(
    [GET_POWER_ACTIVATION_FEE, { address }],
    async () => await getPowerActivationFee()
  );

  return bigNumberToString(powerActivationFee || BigNumber.from(0));
};

export const GET_ACTIVE_AVATAR = 'get-active-avatar';
export const useActiveAvatar = () => {
  const { getActiveAvatar } = useAvatarSettingsContract();
  const { address, isConnected } = useAccount();

  const { data, isLoading, isFetching } = useQuery(
    [GET_ACTIVE_AVATAR, { address }],
    async () => (address ? await getActiveAvatar(address) : null),
    {
      enabled: Boolean(isConnected),
      retry: true,
    }
  );

  return {
    activeAvatar: {
      ...data,
      collection: data?.collection || data?.[0] || ethers.constants.AddressZero,
      tokenId: data?.tokenId || data?.[1],
      isAvatarCollection: data?.isAvatarCollection || Boolean(data?.[2]),
      isPowersAllowed: data?.isPowersAllowed || Boolean(data?.[3]),
    },
    isLoading,
    isFetching,
    hasAvatar: Boolean(data) && data?.['0'] !== ethers.constants.AddressZero,
  };
};

export const GET_AVATAR_METADATA = 'get-avatar-metadata';
export const useAvatarMetadata = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { activeAvatar, hasAvatar } = useActiveAvatar();
  const { address, isConnected } = useAccount();

  const { data, isLoading } = useQuery(
    [GET_AVATAR_METADATA, activeAvatar, { address }],
    async () => {
      if (!activeAvatar || !activeAvatar.tokenId) {
        return;
      }

      const collectionContract = await getContract({
        address: activeAvatar.collection,
        abi: erc721ABI,
        signerOrProvider: signer || provider,
      });

      const encodedString = await collectionContract.tokenURI(activeAvatar.tokenId);
      const base64String = encodedString.split('base64,')[1];

      return JSON.parse(atob(base64String));
    },
    { enabled: isConnected && hasAvatar, staleTime: 0, cacheTime: 0, retry: true }
  );

  const metadata = useMemo(() => {
    const result: Record<string, string> = {};

    if (data && data.attributes) {
      for (const item of data.attributes as {
        trait_type: string;
        value: string;
      }[]) {
        result[item.trait_type] = item.value;
      }
    }

    return result;
  }, [data]);

  return { metadata, isLoading };
};

export const GET_ALL_EVENTS = 'get-all-events';
export const useAllEvents = () => {
  const { address } = useAccount();
  const { getAllUserEvents } = useAvatarSettingsContract();

  const eventsRequest = useQuery(
    [GET_ALL_EVENTS, { address }],
    async () => (address ? await getAllUserEvents(address) : []),
    { staleTime: 0, cacheTime: 0, refetchInterval: 60_000, initialData: [], placeholderData: [] }
  );

  return eventsRequest;
};

export const IS_BIRTHDAY_PRESENT_AVAILABLE = 'is-birthday-present-available';
export const useIsBirthdayPresentAvailable = (tokenId?: BigNumberish) => {
  const { isBirthdayPresentAvailable } = useAvatarSettingsContract();

  const queryResult = useQuery<Boolean>(
    [IS_BIRTHDAY_PRESENT_AVAILABLE, { tokenId }],
    async () => (tokenId !== undefined ? await isBirthdayPresentAvailable(tokenId!) : false),
    {
      cacheTime: 0,
      staleTime: 0,
    }
  );

  useEffect(() => {
    if (tokenId) {
      queryResult.refetch();
    }
  }, [queryResult, tokenId]);

  return queryResult;
};

export const ACTIVATE_POWER = 'activate-power';
export const useActivatePower = (powerId: number) => {
  const { address: avatarSettingsAddress, activatePower } = useAvatarSettingsContract();
  const { powersContract } = usePowersContract();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    [ACTIVATE_AVATAR],
    async () => {
      if (!account) {
        connect();
        return;
      }

      const approved = await powersContract.isApprovedForAll(avatarSettingsAddress, account);

      if (!approved) {
        const tx = await powersContract.setApprovalForAll(avatarSettingsAddress, true);
        const txHash = await waitForTransaction(tx);
        success({ title: 'Approved', txHash });
      }

      const txHash = await activatePower(powerId);
      const letter = ['A', 'B', 'C', 'D'][powerId];
      success({
        title: 'Success',
        description: `Power ${letter} has been activated for one year`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_USER_POWERS] });
        queryClient.invalidateQueries({ queryKey: [GET_POWER_BALANCE] });
        queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return { activatePower: mutateAsync, isLoading };
};

export const ACTIVATE_AVATAR = 'activate-avatar';
export const useActivateAvatar = () => {
  const avatarSettingsContract = useAvatarSettingsContract();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  const { address: avatarAddress } = useContractAbi({
    contract: ContractsEnum.ISaverAvatars,
  });

  const { mutateAsync, isLoading } = useMutation(
    [ACTIVATE_AVATAR],
    async ({
      collectionAddress,
      tokenId,
    }: {
      collectionAddress: Address;
      tokenId: BigNumberish;
    }) => {
      if (!account) {
        connect();
        return;
      }

      const collectionContract = await getContract({
        address: collectionAddress,
        abi: erc721ABI,
        signerOrProvider: signer || provider,
      });
      const approved = await collectionContract.getApproved(BigNumber.from(tokenId));

      if (approved !== avatarSettingsContract.address) {
        const tx = await collectionContract.approve(
          avatarSettingsContract.address,
          BigNumber.from(tokenId)
        );
        const txHash = await waitForTransaction(tx);
        success({ title: 'Approved', txHash });
      }

      const txHash = await avatarSettingsContract.activateAvatar(collectionAddress, tokenId);
      const isAvatarCollection = collectionAddress === avatarAddress;
      const tokenIdString = BigNumber.from(tokenId).add(1).toString().padStart(5, '0');
      success({
        title: 'Success',
        description: isAvatarCollection
          ? `You have activated iSaver Avatar #${tokenIdString}`
          : 'You have activated Avatar',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_ACTIVE_AVATAR] });
        queryClient.invalidateQueries({ queryKey: [GET_NFT] });
        queryClient.invalidateQueries({ queryKey: [GET_USER_POWERS] });
        queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return { activateAvatar: mutateAsync, isLoading };
};

export const DEACTIVATE_AVATAR = 'deactivate-avatar';
export const useDeactivateAvatar = () => {
  const avatarSettingsContract = useAvatarSettingsContract();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();
  const { refetch: refetchAllowedNfts } = useAllowedNFTsForOwner();

  return useMutation(
    [DEACTIVATE_AVATAR],
    async () => {
      if (!account) {
        connect();
        return;
      }

      const txHash = await avatarSettingsContract.deactivateAvatar();
      success({
        title: 'Success',
        description: 'You have deactivated Avatar',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_ACTIVE_AVATAR] });
        queryClient.invalidateQueries({ queryKey: [GET_NFT] });
        queryClient.invalidateQueries({ queryKey: [GET_USER_POWERS] });
        queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });

        refetchAllowedNfts();
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );
};

export const SET_TOKEN_NAME = 'set-token-name';
export const useTokenName = () => {
  const avatarSettingsContract = useAvatarSettingsContract();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  return useMutation(
    [SET_TOKEN_NAME],
    async ({ tokenId, name }: { tokenId: string; name: string }) => {
      if (!account) {
        connect();
        return;
      }

      const txHash = await avatarSettingsContract.setTokenName(tokenId, name);
      success({
        title: 'Success',
        description: 'Avatar name changed',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_ACTIVE_AVATAR] });
        queryClient.invalidateQueries({ queryKey: [GET_AVATAR_METADATA] });
        queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );
};

export const SET_TOKEN_TELEGRAM = 'set-token-telegram';
export const useTokenTelegram = () => {
  const avatarSettingsContract = useAvatarSettingsContract();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  return useMutation(
    [SET_TOKEN_TELEGRAM],
    async ({ tokenId, telegram }: { tokenId: string; telegram: string }) => {
      if (!account) {
        connect();
        return;
      }

      const txHash = await avatarSettingsContract.setTokenTelegram(tokenId, telegram);
      success({
        title: 'Success',
        description: 'Telegram username changed',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_ACTIVE_AVATAR] });
        queryClient.invalidateQueries({ queryKey: [GET_AVATAR_METADATA] });
        queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );
};

export const ACTIVATE_POWER_ACCESS = 'activate-power-access';
export const useActivatePowerAccess = () => {
  const { savToken } = useTokens();
  const { avatarSettings, activatePowerAccess } = useAvatarSettingsContract();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const powerActivationFee = usePowerActivationFee();
  const queryClient = useQueryClient();

  return useMutation(
    [SET_TOKEN_TELEGRAM],
    async () => {
      if (!account) {
        connect();
        return;
      }

      if (powerActivationFee === undefined) {
        return;
      }

      const fee = makeBigNumber(powerActivationFee);
      const allowance = await savToken.allowance(account, avatarSettings.address);

      if (allowance.lt(fee)) {
        const txHash = await savToken.approve(avatarSettings.address, fee);
        success({ title: 'Approved', txHash });
      }

      const txHash = await activatePowerAccess();
      success({
        title: 'Success',
        description: 'You have activated Powers Block',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_ACTIVE_AVATAR] });
        queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );
};

export const CLAIM_PRESENT = 'claim-present';
export const useClaimBirthdayPresent = () => {
  const { claimBirthdayPresent } = useAvatarSettingsContract();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  return useMutation(
    [CLAIM_PRESENT],
    async () => {
      if (!account) {
        connect();
        return;
      }

      const txHash = await claimBirthdayPresent();
      success({
        title: 'Success',
        description: "You have claimed Avatar's birthday present", // eslint-disable-line
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [IS_BIRTHDAY_PRESENT_AVAILABLE] });
        queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );
};
