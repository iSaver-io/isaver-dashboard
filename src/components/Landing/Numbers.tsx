import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Flex, Link, Text, useBreakpoint, useClipboard } from '@chakra-ui/react';
import { useNetwork } from 'wagmi';

import { ReactComponent as CopyIcon } from '@/assets/images/icons/copy-2.svg';
import { ReactComponent as MetamaskIcon } from '@/assets/images/icons/metamask.svg';
import { ReactComponent as PolygonIcon } from '@/assets/images/icons/polygon.svg';
import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useOnVisibleLogger } from '@/hooks/logger/useOnVisibleLogger';
import { useStakingMetrics } from '@/hooks/staking/useStaking';
import { useAddTokens } from '@/hooks/useAddTokens';
import { useLogger } from '@/hooks/useLogger';
import { useNotification } from '@/hooks/useNotification';
import { useTokenSupply } from '@/hooks/useTokenSupply';
import { trimAddress } from '@/utils/address';
import { getExplorerLink } from '@/utils/getExplorerLink';
import { beautifyAmount, bigNumberToNumber } from '@/utils/number';

import './Landing.scss';

export const Numbers = () => {
  const { chain } = useNetwork();
  const { success } = useNotification();
  const { ISaverSAVToken, ISaverSAVRToken } = useContractsAddresses();
  const { onCopy: onSAVCopy, hasCopied: hasSAVCopied } = useClipboard(ISaverSAVToken);
  const { onCopy: onSAVRCopy, hasCopied: hasSAVRCopied } = useClipboard(ISaverSAVRToken);
  const { addSAV, addSAVR } = useAddTokens();
  const { tvlSav, tvlSavr, superPlansMetrics } = useStakingMetrics();
  const savSupply = useTokenSupply(ContractsEnum.SAV);
  const savrSupply = useTokenSupply(ContractsEnum.SAVR);
  const bp = useBreakpoint({ ssr: false });
  const isSm = useMemo(() => bp === 'sm', [bp]);

  const logger = useLogger({
    event: 'landing',
    category: 'elements',
    action: 'element_click',
    buttonLocation: 'mid',
    actionGroup: 'interactions',
  });

  const ref = useRef<HTMLHeadingElement>(null);
  useOnVisibleLogger(ref, {
    event: 'landing',
    category: 'blocks',
    action: 'page_sсroll',
    buttonLocation: 'mid',
    actionGroup: 'interactions',
    label: 'our_numbers',
  });

  const handleAddToken = useCallback(
    (isSav: boolean) => {
      logger({ label: 'add_to_wallet', content: isSav ? 'sav' : 'savr' });
      if (isSav) {
        addSAV();
      } else {
        addSAVR();
      }
    },
    [logger, addSAV, addSAVR]
  );
  const handleAddressCopy = useCallback(
    (isSav: boolean) => {
      logger({ label: 'contract', content: isSav ? 'sav' : 'savr' });
      if (isSav) {
        onSAVCopy();
      } else {
        onSAVRCopy();
      }
    },
    [logger, onSAVCopy, onSAVRCopy]
  );

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
          <Text className="number-item__heading">Token {!isSm ? 'Symbol' : ''}</Text>
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
              <Link
                target="_blank"
                href={getExplorerLink({ chain, hash: ISaverSAVToken, type: 'token' })}
              >
                <PolygonIcon />
              </Link>
              {trimAddress(ISaverSAVToken, 3)}
              <CopyIcon cursor="pointer" onClick={() => handleAddressCopy(true)} />
              <MetamaskIcon cursor="pointer" onClick={() => handleAddToken(true)} />
            </Flex>
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Holders</Text>
          <Text className="number-item__text" color="green.400">
            {'>'} 3 K
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Value Locked</Text>
          <Text className="number-item__text" color="green.400">
            {beautifyAmount(bigNumberToNumber(tvlSav || 0), { precision: 0 })}
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Circulating Supply</Text>
          <Text className="number-item__text" color="green.400">
            {beautifyAmount(bigNumberToNumber(savSupply.circulatingSupply), { precision: 0 })}
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Burned</Text>
          <Text className="number-item__text" color="green.400">
            {beautifyAmount(bigNumberToNumber(savSupply.totalBurned), { precision: 0 })}
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
          <Text className="number-item__heading">Token {!isSm ? 'Symbol' : ''}</Text>
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
              <Link
                target="_blank"
                href={getExplorerLink({ chain, hash: ISaverSAVRToken, type: 'token' })}
              >
                <PolygonIcon />
              </Link>
              {trimAddress(ISaverSAVRToken, 3, false)}
              <CopyIcon cursor="pointer" onClick={() => handleAddressCopy(false)} />
              <MetamaskIcon cursor="pointer" onClick={() => handleAddToken(false)} />
            </Flex>
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Holders</Text>
          <Text className="number-item__text" color="savr">
            ~ 500
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Value Locked</Text>
          <Text className="number-item__text" color="savr">
            {beautifyAmount(bigNumberToNumber(superPlansMetrics.tvl.add(tvlSavr || 0)), {
              precision: 0,
            })}
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Circulating Supply</Text>
          <Text className="number-item__text" color="savr">
            {beautifyAmount(bigNumberToNumber(savrSupply.circulatingSupply), { precision: 0 })}
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Burned</Text>
          <Text className="number-item__text" color="savr">
            {beautifyAmount(bigNumberToNumber(savrSupply.totalBurned), { precision: 0 })}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
