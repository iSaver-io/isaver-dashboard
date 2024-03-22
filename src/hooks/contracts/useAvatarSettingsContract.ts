import { Interface } from '@ethersproject/abi';
import { Log } from 'alchemy-sdk';
import { BigNumberish, Event } from 'ethers';
import { Address, useContract, useProvider, useSigner } from 'wagmi';

import { FROM_BLOCK_EPISODE_2 } from '@/constants';
import alchemy from '@/modules/alchemy';
import { AvatarSettings } from '@/types.common';
import { TypedEvent, TypedEventFilter } from '@/types/typechain-types/common';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

type LogWithEventName = Log & { eventName: string };

const powerActivationLabels: Record<number, string> = {
  0: 'Power A activation',
  1: 'Power B activation',
  2: 'Power C activation',
  3: 'Power D activation',
};

export const useAvatarSettingsContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: avatarSettingsAddress, abi } = useContractAbi({
    contract: ContractsEnum.AvatarSettings,
  });

  const avatarSettings = useContract({
    address: avatarSettingsAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as AvatarSettings;

  const getAllEvents = async (address: Address) => {
    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      alchemy.core.getLogs({ ...filter, fromBlock: FROM_BLOCK_EPISODE_2, toBlock: 'latest' });

    const filters: Record<string, { filter: any; label?: string }> = {
      ExternalAvatarActivated: {
        filter: avatarSettings.filters.ExternalAvatarActivated(address),
        label: 'Avatar activation',
      },
      AvatarActivated: {
        filter: avatarSettings.filters.AvatarActivated(address),
        label: 'iSaver Avatar activation',
      },
      PowersAccessActivated: {
        filter: avatarSettings.filters.PowersAccessActivated(address),
        label: 'Powers Block activation',
      },
      AvatarDeactivated: {
        filter: avatarSettings.filters.AvatarDeactivated(address),
        label: 'Avatar deactivation',
      },
      PowerActivated: {
        filter: avatarSettings.filters.PowerActivated(address),
        // label: 'Power activated',
      },
      NameChanged: {
        filter: avatarSettings.filters.NameChanged(address),
        label: 'Name change',
      },
      TelegramChanged: {
        filter: avatarSettings.filters.TelegramChanged(address),
        label: 'Telegram change',
      },
      BirthdayPresentClaimed: {
        filter: avatarSettings.filters.BirthdayPresentClaimed(null, address),
        label: 'Birthday present claimed',
      },
    };

    const avatarSettingsIface = new Interface(abi);

    let allEvents: LogWithEventName[] = [];
    for (const [key, filter] of Object.entries(filters)) {
      const events = await fetchEvents(filter.filter);
      allEvents = allEvents.concat(events.map((event) => ({ ...event, eventName: key })));
    }

    const events = await Promise.all(
      allEvents.map(async ({ eventName, ...log }: LogWithEventName) => {
        const logParsed = avatarSettingsIface.parseLog(log);
        const block = await provider.getBlock(log.blockNumber);

        let label = '';
        if (eventName === 'PowerActivated') {
          const powerId: number = await logParsed.args.powerId.toNumber();
          label = powerActivationLabels[powerId];
        } else {
          label = filters[eventName].label || '';
          if (eventName === 'AvatarDeactivated' && logParsed.args.isAvatarCollection) {
            label = 'iSaver Avatar deactivation';
          }
        }

        return {
          transactionHash: log.transactionHash,
          label,
          timestamp: block.timestamp,
        };
      })
    );

    const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);

    return sortedEvents;
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
