import { ChangeEvent, FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from '@chakra-ui/react';

import {
  useAvatarMetadata,
  useClaimPrize,
  useIsBirthdayPrizeAvailable,
  useTokenName,
  useTokenTelegram,
} from '@/hooks/useAvatarSettings';
import { useActiveAvatarNFT } from '@/hooks/useNFTHolders';

import { Button } from '../ui/Button/Button';

import { ReactComponent as CheckIcon } from './images/check.svg';
import { ReactComponent as GiftIcon } from './images/gift.svg';
import { ReactComponent as PenIcon } from './images/pen.svg';
import { AvatarPlace } from './AvatarPlace';

export const AvatarComponent = () => {
  const { avatarNFT, hasAvatar, activeAvatar } = useActiveAvatarNFT();
  const { metadata } = useAvatarMetadata();
  const { mutateAsync: setTokenName } = useTokenName();
  const { mutateAsync: setTokenTelegram } = useTokenTelegram();
  const { mutateAsync: claimPrize } = useClaimPrize();
  const { data: hasBirthdayGift = null } = useIsBirthdayPrizeAvailable(activeAvatar?.tokenId);

  const handleNameSave = useCallback(
    (name: string) => {
      if (avatarNFT) {
        return setTokenName({ tokenId: avatarNFT.tokenId, name });
      } else return Promise.resolve();
    },
    [setTokenName, avatarNFT]
  );

  const handleTelegramSave = useCallback(
    (telegram: string) => {
      if (avatarNFT) {
        return setTokenTelegram({ tokenId: avatarNFT.tokenId, telegram });
      } else return Promise.resolve();
    },
    [setTokenTelegram, avatarNFT]
  );

  const validateName = useCallback((value: string) => {
    const regex = /^[A-Za-z ]{1,30}$/;
    return regex.test(value);
  }, []);
  const validateTelegram = useCallback((value: string) => {
    const regex = /^@[A-Za-z0-9_]{5,32}$/;
    return regex.test(value);
  }, []);

  return (
    <>
      <Flex
        className={[
          'avatarComponent',
          hasAvatar && !activeAvatar?.isAvatarCollection && 'avatarComponent--external',
        ].join(' ')}
      >
        <AvatarPlace />
        <Box className="traitsMain">
          {activeAvatar?.isAvatarCollection || !hasAvatar ? (
            <>
              <Box className="traitsMain_item">
                <Text
                  textStyle="textBold"
                  textTransform="uppercase"
                  color="green.400"
                  fontSize="18px"
                >
                  Birthday:
                </Text>
                <Flex className="traitsMain_item_inputGroup">
                  <Text textStyle="textBold" fontSize="18px" fontWeight="500">
                    {metadata.Birthday}
                  </Text>

                  {hasBirthdayGift ? (
                    <Flex alignItems="center">
                      <Button
                        height="25px"
                        width="80px"
                        fontSize="12px"
                        size="sm"
                        variant="outlinedWhite"
                        onClick={() => claimPrize()}
                      >
                        Claim
                      </Button>
                      <Box color="green.400" ml="12px">
                        <GiftIcon />
                      </Box>
                    </Flex>
                  ) : null}
                </Flex>
              </Box>

              <TraitItem
                label="Name"
                placeholder="Name"
                defaultValue={metadata.Name}
                onSave={handleNameSave}
                validate={validateName}
                Icon={PenIcon}
              />
              <TraitItem
                label="Telegram"
                placeholder="@username"
                defaultValue={metadata.Telegram}
                isTelegram
                onSave={handleTelegramSave}
                validate={validateTelegram}
                Icon={PenIcon}
              />
            </>
          ) : (
            <>
              <Text textStyle="text2" fontSize={{ xl: '18px' }}>
                You have activated the Avatar of someone else's collection. To have all the
                features, activate iSaver Avatar.
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
    </>
  );
};

type TraitItemProps = {
  label: string;
  defaultValue: string;
  placeholder?: string;
  isTelegram?: boolean;
  onSave: (val: string) => Promise<void>;
  validate: (val: string) => boolean;
  Icon: FunctionComponent;
};

const TraitItem = ({
  label,
  defaultValue,
  placeholder,
  isTelegram,
  onSave,
  validate,
  Icon,
}: TraitItemProps) => {
  const [value, setValue] = useState(defaultValue);
  const [isModified, setIsModified] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.trimStart();
      if (isTelegram && !val.startsWith('@')) {
        val = '@' + val;
      }
      setValue(val);
    },
    [isTelegram]
  );

  useEffect(() => {
    const _isValid = validate(value);
    setIsModified(value !== defaultValue && _isValid);
    setIsValid(_isValid);
  }, [defaultValue, value, validate]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSave = useCallback(
    (val: string) => {
      if (validate(val)) {
        setIsLoading(true);
        onSave(val).finally(() => setIsLoading(false));
      }
    },
    [onSave, validate]
  );

  const handleClick = useCallback(() => {
    if (isModified) {
      handleSave(value);
    } else {
      inputRef.current?.focus();
    }
  }, [isModified, handleSave, value]);

  return (
    <Box className="traitsMain_item">
      <Text textStyle="textBold" textTransform="uppercase" color="green.400" fontSize="18px">
        {label}:
      </Text>
      <Box className={['traitsMain_item_inputGroup', !isValid && 'invalid'].join(' ')}>
        <InputGroup>
          <Input
            ref={inputRef}
            onChange={handleChange}
            variant="transparent"
            fontSize="18px"
            fontWeight="500"
            value={value || ''}
            placeholder={placeholder}
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSave(value);
              }
            }}
            onFocus={(e) =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              )
            }
          />
          <InputRightElement m="0" p="0" height="24px" width="24px">
            <IconButton
              size="sm"
              variant="iconButton"
              aria-label="Save changes"
              icon={isModified ? <CheckIcon /> : <Icon />}
              isLoading={isLoading}
              onClick={handleClick}
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </Box>
  );
};
