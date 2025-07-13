import { Interface } from '@ethersproject/abi';
import { Log } from 'alchemy-sdk';
import { BigNumberish, Event } from 'ethers';
import { Address, useContract, useProvider, useSigner } from 'wagmi';

import { getLogs } from '@/api/getLogs';
import { FROM_BLOCK_EPISODE_2 } from '@/constants';
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
  const avatarSettingsIface = new Interface(abi);

  const avatarSettings = useContract({
    address: avatarSettingsAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as unknown as AvatarSettings;

  const getAllUserEvents = async (address: Address) => {
    const fetchAllEvents = async () => {
      // Создаем фильтр для всех событий, связанных с пользователем
      const allFilters = [
        avatarSettings.filters.ExternalAvatarActivated(address),
        avatarSettings.filters.AvatarActivated(address),
        avatarSettings.filters.PowersAccessActivated(address),
        avatarSettings.filters.AvatarDeactivated(address),
        avatarSettings.filters.PowerActivated(address),
        avatarSettings.filters.NameChanged(address),
        avatarSettings.filters.TelegramChanged(address),
        avatarSettings.filters.BirthdayPresentClaimed(null, address),
      ];

      // Объединяем все topics в один массив для одного запроса
      const allTopics = allFilters.flatMap((filter) => filter.topics || []);

      // Убираем дубликаты topics
      const uniqueTopics = allTopics.filter((topic, index, arr) => arr.indexOf(topic) === index);

      // Делаем один запрос для всех событий
      const allLogs = await getLogs(avatarSettingsAddress, [], FROM_BLOCK_EPISODE_2, 'latest');

      return allLogs;
    };

    const eventLabels: Record<string, string> = {
      ExternalAvatarActivated: 'Avatar activation',
      AvatarActivated: 'iSaver Avatar activation',
      PowersAccessActivated: 'Powers Block activation',
      AvatarDeactivated: 'Avatar deactivation',
      PowerActivated: 'Power activation',
      NameChanged: 'Name change',
      TelegramChanged: 'Telegram change',
      BirthdayPresentClaimed: 'Birthday present claimed',
    };

    const allLogs = await fetchAllEvents();

    const events = await Promise.all(
      allLogs
        .map(async (log) => {
          try {
            const parsedLog = avatarSettingsIface.parseLog(log);
            const eventName = parsedLog.name;

            // Проверяем, что событие связано с нужным пользователем
            if (eventName === 'ExternalAvatarActivated' && parsedLog.args.sender !== address) {
              return null;
            } else if (eventName === 'AvatarActivated' && parsedLog.args.sender !== address) {
              return null;
            } else if (eventName === 'PowersAccessActivated' && parsedLog.args.sender !== address) {
              return null;
            } else if (eventName === 'AvatarDeactivated' && parsedLog.args.sender !== address) {
              return null;
            } else if (eventName === 'BirthdayPresentClaimed' && parsedLog.args.owner !== address) {
              return null;
            } else if (eventName === 'PowerActivated' && parsedLog.args.sender !== address) {
              return null;
            } else if (eventName === 'NameChanged' && parsedLog.args.sender !== address) {
              return null;
            } else if (eventName === 'TelegramChanged' && parsedLog.args.sender !== address) {
              return null;
            }
            if (!Object.keys(eventLabels).includes(eventName)) {
              return null;
            }

            const block = await provider.getBlock(log.blockNumber);

            let label = '';
            if (eventName === 'PowerActivated') {
              const powerId: number = await parsedLog.args.powerId.toNumber();
              label = powerActivationLabels[powerId];
            } else if (eventName === 'AvatarDeactivated' && parsedLog.args.isAvatarCollection) {
              label = 'iSaver Avatar deactivation';
            } else {
              label = eventLabels[eventName] || '';
            }

            if (!label) {
              console.log('label for event not found', eventName);
            }

            return {
              transactionHash: log.transactionHash,
              label,
              timestamp: block.timestamp,
            };
          } catch (error) {
            console.error('Error parsing event:', error);
            return null;
          }
        })
        .filter(Boolean)
    );

    const nonEmptyEvents = events.filter(Boolean) as {
      transactionHash: string;
      label: string;
      timestamp: number;
    }[];
    const sortedEvents = nonEmptyEvents.sort((a, b) => a.timestamp - b.timestamp);

    return sortedEvents;
  };

  const getApprovedCollections = async (): Promise<Address[]> => {
    const filter = avatarSettings.filters.CollectionApprovalUpdated();
    const rawEvents = await getLogs(filter.address, filter.topics, FROM_BLOCK_EPISODE_2, 'latest');
    const events = rawEvents.map((event) => ({ ...event, ...avatarSettingsIface.parseLog(event) }));

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

  const getActivatePowerEvents = async () => {
    const filter = avatarSettings.filters.PowerActivated();

    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      getLogs(filter.address, filter.topics, FROM_BLOCK_EPISODE_2, 'latest');

    const events = await fetchEvents(filter);

    return events.map((event) => ({ ...event, ...avatarSettingsIface.parseLog(event) }));
  };
  const getDeactivateAvatarEvents = async () => {
    const filter = avatarSettings.filters.AvatarDeactivated();

    const fetchEvents = async (filter: TypedEventFilter<TypedEvent<Event[]>>) =>
      getLogs(filter.address, filter.topics, FROM_BLOCK_EPISODE_2, 'latest');

    const events = await fetchEvents(filter);
    return events.map((event) => ({ ...event, ...avatarSettingsIface.parseLog(event) }));
  };

  const getStatistic = () => {
    return avatarSettings.getStatistic();
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

  const updatePowerActivationFee = async (fee: BigNumberish) => {
    const tx = await avatarSettings.updatePowerActivationFee(fee);
    return waitForTransaction(tx);
  };

  const approveExternalCollection = async (collectionAddress: string, isApproved: boolean) => {
    const tx = await avatarSettings.approveCollection(collectionAddress, isApproved);
    return waitForTransaction(tx);
  };

  return {
    avatarSettings,
    address: avatarSettingsAddress,
    getApprovedCollections,
    getActiveAvatar,
    getPowerActivationFee,
    getUserPower,
    getStatistic,
    activatePowerAccess,
    activateAvatar,
    activatePower,
    deactivateAvatar,
    setTokenName,
    setTokenTelegram,
    getAllUserEvents,
    getActivatePowerEvents,
    getDeactivateAvatarEvents,
    isBirthdayPresentAvailable,
    claimBirthdayPresent,
    hasPowerA,
    hasPowerB,
    hasPowerC,
    hasPowerD,
    getPowerEndingTime,
    updatePowerActivationFee,
    approveExternalCollection,
  };
};
