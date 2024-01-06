import { ChangeEvent, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Input, Link, Text } from '@chakra-ui/react';

import {
  useActiveAvatar,
  useAvatarMetadata,
  useTokenName,
  useTokenTelegram,
} from '@/hooks/useAvatarSettings';
import { useNFT } from '@/hooks/useNFTHolders';

import CheckIcon from './images/check.svg';
import GiftIcon from './images/gift.svg';
import PenIcon from './images/pen.svg';
import { AvatarPlace } from './AvatarPlace';

export const AvatarComponent = ({ onOpen }: { onOpen: () => void }) => {
  const { nft } = useNFT();
  const { activeAvatar } = useActiveAvatar();
  const { metadata } = useAvatarMetadata();
  const [name, setName] = useState('');
  const [telegram, setTelegram] = useState('');
  const [isNameModified, setIsNameModified] = useState(false);
  const [isTelegramModified, setIsTelegramModified] = useState(false);
  const { mutateAsync: setTokenName, isLoading: isNameLoading } = useTokenName();
  const { mutateAsync: setTokenTelegram, isLoading: isTelegramLoading } = useTokenTelegram();

  useEffect(() => {
    if (metadata.Name) {
      setName(metadata.Name);
    }

    if (metadata.Telegram) {
      setTelegram(metadata.Telegram);
    }
  }, [metadata]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    if (newValue) {
      setIsNameModified(true);
    }
  };

  const handleNameSave = async () => {
    if (nft && isNameModified) {
      await setTokenName({ tokenId: nft.tokenId, name });
      setIsNameModified(false);
    }
  };

  const handleTelegramChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTelegram(newValue);
    if (newValue) {
      setIsTelegramModified(true);
    }
  };

  const handleTelegramSave = async () => {
    if (nft && isTelegramModified) {
      await setTokenTelegram({ tokenId: nft.tokenId, telegram });
      setIsTelegramModified(false);
    }
  };

  return (
    <Flex className="avatarComponent">
      <AvatarPlace onOpen={onOpen} />
      <Box className="traitsMain">
        {activeAvatar?.isAvatarCollection ? (
          <>
            <TraitItem
              label="Birthday"
              value={metadata.Birthday}
              Icon={GiftIcon}
              isDisabled={true}
            />
            <TraitItem
              label="Name"
              value={name}
              onChange={handleNameChange}
              onSave={handleNameSave}
              isModified={isNameModified}
              isDisabled={isNameLoading}
              Icon={PenIcon}
            />
            <TraitItem
              label="Telegram"
              value={telegram}
              onChange={handleTelegramChange}
              onSave={handleTelegramSave}
              isModified={isTelegramModified}
              isDisabled={isTelegramLoading}
              Icon={PenIcon}
            />
          </>
        ) : (
          <>
            <Text textStyle="text2">
              You have activated the Avatar of someone else's collection. To have all the features,
              activate iSaver Avatar.
            </Text>
            <Text textStyle="text2">
              A more detailed is{' '}
              <Link as={RouterLink} to="/" color="savr">
                here
              </Link>
            </Text>
          </>
        )}
      </Box>
    </Flex>
  );
};

type TraitItemProps = {
  label: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSave?: () => Promise<void>;
  isModified?: boolean;
  isDisabled?: boolean;
  Icon: string;
};

const TraitItem = ({
  label,
  value,
  onChange,
  onSave,
  isModified,
  isDisabled,
  Icon,
}: TraitItemProps) => (
  <Box className="traitsMain_item">
    <Text textStyle="textBold" textTransform="uppercase" color="green.400">
      {label}:
    </Text>
    <div className="traitsMain_item_inputGroup">
      <Input
        onChange={onChange}
        variant="transparent"
        value={value}
        placeholder={label}
        disabled={isDisabled}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && onSave) {
            onSave();
          }
        }}
      />
      {isModified && onSave ? (
        <img src={CheckIcon} alt="check" onClick={onSave} />
      ) : (
        <img src={Icon} alt={label.toLowerCase()} />
      )}
    </div>
  </Box>
);
