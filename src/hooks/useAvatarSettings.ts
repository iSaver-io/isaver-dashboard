import { useEffect, useMemo } from 'react';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import {
  Address,
  erc721ABI,
  useAccount,
  useMutation,
  useProvider,
  useQuery,
  useQueryClient,
  useSigner,
} from 'wagmi';
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
  const { address } = useAccount();

  const { data, isLoading } = useQuery(
    [GET_ACTIVE_AVATAR, { address }],
    async () => (address ? await getActiveAvatar(address) : null),
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: Boolean(address),
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
    hasAvatar: Boolean(data) && data?.['0'] !== ethers.constants.AddressZero,
  };
};

export const GET_AVATAR_METADATA = 'get-avatar-metadata';
export const useAvatarMetadata = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { activeAvatar, hasAvatar } = useActiveAvatar();
  const { address } = useAccount();

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
    { enabled: hasAvatar, staleTime: 0, cacheTime: 0 }
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
  const { getAllEvents } = useAvatarSettingsContract();

  const { data, isLoading } = useQuery(
    [GET_ALL_EVENTS, { address }],
    async () => {
      const res = address ? await getAllEvents(address) : null;
      return res;
    },
    { staleTime: 0, cacheTime: 0, refetchInterval: 10_000 }
  );

  return { events: data || [], isLoading };
};

export const IS_BIRTHDAY_PRIZE_AVAILABLE = 'is-birthday-prize-available';
export const useIsBirthdayPrizeAvailable = (tokenId?: BigNumberish) => {
  const { isBirthdayPrizeAvailable } = useAvatarSettingsContract();

  const queryResult = useQuery<Boolean>(
    [GET_APPROVED_COLLECTIONS, { tokenId }],
    async () => await isBirthdayPrizeAvailable(tokenId!),
    {
      enabled: Boolean(tokenId),
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
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
        }, 60_000);
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

        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
        }, 60_000);
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

        refetchAllowedNfts();

        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
        }, 60_000);
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
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
        }, 60_000);
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
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
        }, 60_000);
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
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
        }, 60_000);
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );
};

export const CLAIM_PRIZE = 'claim-prize';
export const useClaimPrize = () => {
  const { claimPrize } = useAvatarSettingsContract();
  const { address: account } = useAccount();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();
  const queryClient = useQueryClient();

  return useMutation(
    [CLAIM_PRIZE],
    async () => {
      if (!account) {
        connect();
        return;
      }

      const txHash = await claimPrize();
      success({
        title: 'Success',
        description: 'You successfully claimed your birthday prize',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [IS_BIRTHDAY_PRIZE_AVAILABLE] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );
};
