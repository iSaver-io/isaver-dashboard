import { useEffect, useRef } from 'react';
import { Flex, Link, Text, useClipboard } from '@chakra-ui/react';
import { useNetwork } from 'wagmi';

import { ReactComponent as CoptyIcon } from '@/assets/images/icons/copy-2.svg';
import { ReactComponent as MetamaskIcon } from '@/assets/images/icons/metamask.svg';
import { ReactComponent as PolygonIcon } from '@/assets/images/icons/polygon.svg';
import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { useOnVisibleLogger } from '@/hooks/logger/useOnVisibleLogger';
import { useAddTokens } from '@/hooks/useAddTokens';
import { useNotification } from '@/hooks/useNotification';
import { trimAddress } from '@/utils/address';
import { getExplorerLink } from '@/utils/getExplorerLink';

import './Landing.scss';

export const Numbers = () => {
  const { chain } = useNetwork();
  const { success } = useNotification();
  const { ISaverSAVToken, ISaverSAVRToken } = useContractsAddresses();
  const { onCopy: onSAVCopy, hasCopied: hasSAVCopied } = useClipboard(ISaverSAVToken);
  const { onCopy: onSAVRCopy, hasCopied: hasSAVRCopied } = useClipboard(ISaverSAVRToken);

  const { addSAV, addSAVR } = useAddTokens();

  const ref = useRef<HTMLHeadingElement>(null);
  useOnVisibleLogger(ref, 'our_numbers');

  useEffect(() => {
    if (hasSAVCopied || hasSAVRCopied) {
      success({ title: 'Copied!' });
    }
  }, [hasSAVCopied, hasSAVRCopied, success]);

  return (
    <Flex mb={{ sm: '80px', xl: '100px', '2xl': '100px' }} justifyContent="center" flexWrap="wrap">
      <Flex w="100%" justifyContent="center">
        <h4 className="heading" ref={ref}>
          Our numbers
        </h4>
      </Flex>
      <Flex flexWrap="wrap" justifyContent="space-between" className="number">
        <Flex className="number-item">
          <Text className="number-item__heading">Token Symbol</Text>
          <Text className="number-item__text" color="green.400">
            SAV
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Contract</Text>
          <Text
            className="number-item__text"
            fontSize={{ sm: '16px', lg: '18px', xl: '26px' }}
            color="green.400"
          >
            <Flex gap="13px" alignItems="center">
              <Link target="_blank" href={getExplorerLink(chain, ISaverSAVToken, false)}>
                <PolygonIcon />
              </Link>
              {trimAddress(ISaverSAVToken, 3, false)}
              <CoptyIcon cursor="pointer" onClick={onSAVCopy} />
              <MetamaskIcon cursor="pointer" onClick={addSAV} />
            </Flex>
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Holders</Text>
          <Text className="number-item__text" color="green.400">
            {'>'} 2 K
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Value Locked</Text>
          <Text className="number-item__text" color="green.400">
            115 344
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Circulating Supply</Text>
          <Text className="number-item__text" color="green.400">
            1 000 M
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Burned</Text>
          <Text className="number-item__text" color="green.400">
            5 344
          </Text>
        </Flex>
      </Flex>
      <Flex
        flexWrap="wrap"
        justifyContent="space-between"
        className="number"
        mt={{ sm: '50px', '2xl': '80px' }}
      >
        <Flex className="number-item">
          <Text className="number-item__heading">Token Symbol</Text>
          <Text className="number-item__text" color="savr">
            SAVR
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Contract</Text>
          <Text
            className="number-item__text"
            fontSize={{ sm: '16px', lg: '18px', xl: '26px' }}
            color="savr"
          >
            <Flex gap="13px" alignItems="center">
              <Link target="_blank" href={getExplorerLink(chain, ISaverSAVRToken, false)}>
                <PolygonIcon />
              </Link>
              {trimAddress(ISaverSAVRToken, 3, false)}
              <CoptyIcon cursor="pointer" onClick={onSAVRCopy} />
              <MetamaskIcon cursor="pointer" onClick={addSAVR} />
            </Flex>
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Holders</Text>
          <Text className="number-item__text" color="savr">
            {'>'} 2 K
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Value Locked</Text>
          <Text className="number-item__text" color="savr">
            115 344
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Circulating Supply</Text>
          <Text className="number-item__text" color="savr">
            1 000 M
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Burned</Text>
          <Text className="number-item__text" color="savr">
            5 344
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
