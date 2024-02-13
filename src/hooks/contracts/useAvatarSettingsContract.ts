import EthDater from 'ethereum-block-by-date';
import { BigNumberish, Event } from 'ethers';
import { Address, useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK } from '@/constants';
import { AvatarSettings } from '@/types.common';
import { TypedEvent, TypedEventFilter } from '@/types/typechain-types/common';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

const eventLabels: Record<string, string> = {
  ExternalAvatarActivated: 'Avatar activation',
  AvatarActivated: 'iSaver Avatar activation',
  PowersAccessActivated: 'Powers Block activation',
  AvatarDeactivated: 'Avatar deactivation',
  ISaverAvatarDeactivated: 'iSaver Avatar deactivation',
  NameChanged: 'Name change',
  TelegramChanged: 'Telegram change',
  BirthdayPresentClaimed: 'Birthday present claimed',
};

const powerActivationLabels: Record<number, string> = {
  0: 'Power A activation',
  1: 'Power B activation',
  2: 'Power C activation',
  3: 'Power D activation',
};

export const useAvatarSettingsContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const dater = new EthDater(provider);

  const { address: avatarSettingsAddress, abi } = useContractAbi({
    contract: ContractsEnum.AvatarSettings,
  });

  const avatarSettings = useContract({
    address: avatarSettingsAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as AvatarSettings;

  const getAllEvents = async (address: Address) => {
    const { block: toBlock } = await dater.getDate(new Date());

    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      avatarSettings.queryFilter(filter, FROM_BLOCK, toBlock);

    const filters = [
      avatarSettings.filters.ExternalAvatarActivated(address),
      avatarSettings.filters.AvatarActivated(address),
      avatarSettings.filters.PowersAccessActivated(address),
      avatarSettings.filters.AvatarDeactivated(address),
      avatarSettings.filters.PowerActivated(address),
      avatarSettings.filters.NameChanged(address),
      avatarSettings.filters.TelegramChanged(address),
      avatarSettings.filters.BirthdayPresentClaimed(null, address),
    ];

    let allEvents: Event[] = [];
    for (const filter of filters) {
      const events = await fetchEvents(filter);
      allEvents = allEvents.concat(events);
    }

    return await Promise.all(
      allEvents.map(async ({ blockNumber, event, args, transactionHash }: Event) => {
        const block = await provider.getBlock(blockNumber);

        let label = '';
        if (event === 'PowerActivated') {
          const powerId: number = await args?.powerId.toNumber();
          label = powerActivationLabels[powerId];
        } else if (event) {
          label = eventLabels[event];
          if (event === 'AvatarDeactivated' && args?.isAvatarCollection) {
            label = eventLabels['ISaverAvatarDeactivated'];
          }
        }

        return {
          transactionHash,
          label,
          timestamp: block.timestamp,
        };
      })
    );
  };

  const getApprovedCollections = async (): Promise<Address[]> => {
    const filter = avatarSettings.filters.CollectionApprovalUpdated(null, null);
    const events = await avatarSettings.queryFilter(filter);

    const activeCollections = new Set();

    for (const event of events) {
      const { collection, approved } = event.args;

      if (approved) {
        activeCollections.add(collection);
      } else {
        activeCollections.delete(collection);
      }
    }

    return Array.from(activeCollections) as Address[];
  };

  const getActiveAvatar = async (owner: Address) => {
    return await avatarSettings.activeAvatars(owner);
  };

  const getPowerActivationFee = async () => {
    return await avatarSettings.powerActivationFee();
  };

  const getUserPower = async (address: Address, powerId: number) => {
    return await avatarSettings.userPowers(address, powerId);
  };

  const isBirthdayPresentAvailable = async (tokenId: BigNumberish) => {
    return await avatarSettings.isBirthdayPresentAvailable(tokenId);
  };

  const activateAvatar = async (collectionAddress: Address, tokenId: BigNumberish) => {
    const tx = await avatarSettings.activateAvatar(collectionAddress, tokenId);
    return waitForTransaction(tx);
  };

  const activatePower = async (powerId: number) => {
    const tx = await avatarSettings.activatePower(powerId);
    return waitForTransaction(tx);
  };

  const activatePowerAccess = async () => {
    const tx = await avatarSettings.activatePowerAccess();
    return waitForTransaction(tx);
  };

  const deactivateAvatar = async () => {
    const tx = await avatarSettings.deactivateAvatar();
    return waitForTransaction(tx);
  };

  const setTokenName = async (tokenId: BigNumberish, name: string) => {
    const tx = await avatarSettings.setTokenName(tokenId, name);
    return waitForTransaction(tx);
  };

  const setTokenTelegram = async (tokenId: BigNumberish, telegram: string) => {
    const tx = await avatarSettings.setTokenTelegram(tokenId, telegram);
    return waitForTransaction(tx);
  };

  const claimBirthdayPresent = async () => {
    const tx = await avatarSettings.claimBirthdayPresent();
    return waitForTransaction(tx);
  };

  const hasPowerA = async (user: Address) => {
    return await avatarSettings.hasPowerA(user);
  };
  const hasPowerB = async (user: Address) => {
    return await avatarSettings.hasPowerD(user);
  };
  const hasPowerC = async (user: Address) => {
    return await avatarSettings.hasPowerC(user);
  };
  const hasPowerD = async (user: Address) => {
    return await avatarSettings.hasPowerD(user);
  };

  const getPowerEndingTime = async (user: Address, powerId: number) => {
    return await avatarSettings.getPowerEndingTime(user, powerId);
  };

  return {
    avatarSettings,
    address: avatarSettingsAddress,
    getApprovedCollections,
    getActiveAvatar,
    getPowerActivationFee,
    getUserPower,
    activatePowerAccess,
    activateAvatar,
    activatePower,
    deactivateAvatar,
    setTokenName,
    setTokenTelegram,
    getAllEvents,
    isBirthdayPresentAvailable,
    claimBirthdayPresent,
    hasPowerA,
    hasPowerB,
    hasPowerC,
    hasPowerD,
    getPowerEndingTime,
  };
};
