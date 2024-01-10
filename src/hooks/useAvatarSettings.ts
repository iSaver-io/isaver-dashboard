import { useMemo } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
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

import { makeBigNumber } from '@/utils/number';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { useAvatarSettingsContract } from './contracts/useAvatarSettingsContract';
import { usePowersContract } from './contracts/usePowersContract';
import { useConnectWallet } from './useConnectWallet';
import { GET_NFT } from './useNFTHolders';
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

  return userPowers || BigNumber.from(0);
};

export const GET_POWER_ACTIVATION_FEE = 'get-power-activation-fee';
export const usePowerActivationFee = () => {
  const { getPowerActivationFee } = useAvatarSettingsContract();
  const { address } = useAccount();

  const { data: powerActivationFee } = useQuery(
    [GET_POWER_ACTIVATION_FEE, { address }],
    async () => await getPowerActivationFee()
  );

  return powerActivationFee;
};

export const GET_ACTIVE_AVATAR = 'get-active-avatar';
export const useActiveAvatar = () => {
  const { getActiveAvatar } = useAvatarSettingsContract();
  const { address } = useAccount();

  const { data, isLoading } = useQuery([GET_ACTIVE_AVATAR, { address }], async () =>
    address ? await getActiveAvatar(address) : null
  );

  return { activeAvatar: data, isLoading };
};

export const GET_AVATAR_METADATA = 'get-avatar-metadata';
export const useAvatarMetadata = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { activeAvatar } = useActiveAvatar();
  const { address } = useAccount();

  const { data, isLoading } = useQuery([GET_AVATAR_METADATA, { address }], async () => {
    if (!activeAvatar) {
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
  });

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

  return { metadata: metadata, isLoading };
};

export const GET_ALL_EVENTS = 'get-all-events';
export const useAllEvents = () => {
  const { address } = useAccount();
  const { getAllEvents } = useAvatarSettingsContract();

  const { data, isLoading } = useQuery([GET_ALL_EVENTS, { address }], async () =>
    address ? await getAllEvents(address) : null
  );

  return { events: data || [], isLoading };
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
      success({
        title: 'Success',
        description: 'You have activated the Power',
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
      success({
        title: 'Success',
        description: 'You have activated the avatar',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_ACTIVE_AVATAR] });
        queryClient.invalidateQueries({ queryKey: [GET_NFT] });
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
        description: 'You have successfully deactivated the avatar',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_ACTIVE_AVATAR] });
        queryClient.invalidateQueries({ queryKey: [GET_NFT] });
        queryClient.invalidateQueries({ queryKey: [GET_ALL_EVENTS] });
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
        description: 'Name successfully set',
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
        description: 'Telegram successfully set',
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
        description: 'Power access has been successfully activated',
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