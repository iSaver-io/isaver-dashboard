import React, { useCallback, useRef, useState } from 'react';
import { Box, Flex, Input, InputGroup, InputRightElement, Link, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { sendDataMessage } from '@/api/sendDataMessage';
import { Logo } from '@/assets/images/icons-components/Logo';
import { ReactComponent as ArrowIcon } from '@/components/Landing/images/arrow-right.svg';
import { ReactComponent as DiscordIcon } from '@/components/Landing/images/discord.svg';
import { ReactComponent as GithubIcon } from '@/components/Landing/images/github.svg';
import { ReactComponent as OpenseaIcon } from '@/components/Landing/images/opensea.svg';
import { ReactComponent as SavIcon } from '@/components/Landing/images/sav.svg';
import { ReactComponent as SavrIcon } from '@/components/Landing/images/savr.svg';
import { ReactComponent as TwitterIcon } from '@/components/Landing/images/twitter.svg';
import { useDebounce } from '@/hooks/useDebounce';
import { useLogger } from '@/hooks/useLogger';
import { useNotification } from '@/hooks/useNotification';
import { validateEmail } from '@/utils/email';

import './Footer.scss';

export const Footer = () => {
  const { address } = useAccount();
  const [email, setEmail] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { success, handleError } = useNotification();
  const logger = useLogger({ event: 'cross', buttonLocation: 'footer' });
  const debouncedLogger = useDebounce(logger);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;

      setEmail(email);
      if (email && validateEmail(email)) {
        debouncedLogger({
          category: 'forms',
          action: 'form_add',
          label: 'email',
          actionGroup: 'interactions',
        });
      }
    },
    [debouncedLogger]
  );

  const submitEmail = useCallback(
    (e: any) => {
      e.preventDefault();
      if (email && validateEmail(email)) {
        const message = `Пользователь оставил Email: ${email}\nКошелек: ${
          address || '<i>не авторизован</i>'
        }`;
        sendDataMessage(message)
          .then(() => {
            success({ title: 'Email was accepted' });
            setEmail('');
            inputRef.current?.blur();
          })
          .catch((e) => {
            handleError(e);
          });

        logger({
          category: 'forms',
          action: 'element_click',
          label: 'send',
          actionGroup: 'conversions',
        });
      }
    },
    [email, address, setEmail, success, handleError, logger]
  );

  const handleSocialLinkClick = useCallback(
    (type: string) => {
      logger({
        category: 'elements',
        action: 'social_click',
        label: type,
        actionGroup: 'interactions',
      });
    },
    [logger]
  );

  const handleEmailLinkClick = useCallback(() => {
    logger({
      category: 'elements',
      action: 'link_click',
      label: 'email',
      actionGroup: 'interactions',
    });
  }, [logger]);

  return (
    <Box className="footer">
      <Flex className="footer-top">
        <Flex className="footer-top__left">
          <Box
            height={{ sm: '40px', md: '66px', xl: '86px' }}
            width={{ sm: '140px', md: '226px', xl: '294px' }}
          >
            <Logo />
          </Box>
        </Flex>
        <Flex className="footer-top__right">
          <Flex className="mail-list" flexDirection="column">
            <Text className="mail-list__heading">Join our mailing list</Text>
            <Text className="mail-list__subheading">Subscribe for updates and new features</Text>
            <form onSubmit={submitEmail}>
              <InputGroup
                border="none"
                boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
                bgColor="rgba(38, 71, 55, 0.5)"
                borderRadius="10px"
              >
                <Input
                  type="email"
                  ref={inputRef}
                  className="mail-list__input"
                  placeholder="Your email"
                  variant="mailing"
                  pr="0"
                  mr="50px"
                  value={email}
                  onChange={handleEmailChange}
                />
                <InputRightElement
                  mr="0"
                  pr="16px"
                  width="60px"
                  cursor="pointer"
                  children={<ArrowIcon width="100%" />}
                  onClick={submitEmail}
                />
              </InputGroup>
            </form>
          </Flex>
          <Flex className="sav-container">
            <Box>
              <Flex className="sav-container__item" alignItems="center">
                <SavIcon />
                <Text ml="5px">1 SAV = 1 USDT</Text>
              </Flex>
              <Flex className="sav-container__item" alignItems="center">
                <SavrIcon />
                <Text ml="5px">1 SAVR = 1 USDT</Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Box className="footer-bottom">
        <Flex className="footer-bottom__container" flexWrap="wrap" justifyContent="space-between">
          <Box className="footer-bottom__left">
            <Text className="footer-heading">Disclaimer</Text>
            <Text className="footer-text">
              The contents and opinions of this website are those of iSaver. iSaver&nbsp;is&nbsp;not
              responsible for any of your crypto losses. Please do not construe any of the above
              statements as to financial advice. Cryptocurrency investment is subject to high market
              risk!
            </Text>
          </Box>
          <Flex
            className="footer-bottom__right"
            flexDirection="column"
            alignItems="center"
            pt="10px"
          >
            <Text className="contact-heading">Contact us</Text>
            <Flex className="contact-icons" justifyContent="center">
              <a
                href="https://twitter.com/iSaver_official"
                target="_blank"
                rel="noreferrer"
                onClick={() => handleSocialLinkClick('twitter')}
              >
                <TwitterIcon />
              </a>
              <a
                href="https://discord.gg/GmrPBZcd"
                target="_blank"
                rel="noreferrer"
                onClick={() => handleSocialLinkClick('discord')}
              >
                <DiscordIcon />
              </a>
              <a
                href="https://github.com/iSaver-io"
                target="_blank"
                rel="noreferrer"
                onClick={() => handleSocialLinkClick('github')}
              >
                <GithubIcon />
              </a>
              <a
                href="https://opensea.io/iSaverCreator/created"
                target="_blank"
                rel="noreferrer"
                onClick={() => handleSocialLinkClick('opensea')}
              >
                <OpenseaIcon />
              </a>
            </Flex>
            <Link
              className="contact-mail"
              href="mailto:hello@isaver.io"
              target="_blank"
              onClick={handleEmailLinkClick}
            >
              hello@isaver.io
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
