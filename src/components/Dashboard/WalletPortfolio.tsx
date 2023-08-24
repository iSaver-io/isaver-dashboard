import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ReactComponent as BoxIcon } from '@/assets/images/icons/box.svg';
import { ReactComponent as PlusIcon } from '@/assets/images/icons/plus.svg';
import { ReactComponent as PuzzlesIcon } from '@/assets/images/icons/puzzles.svg';
import { Button } from '@/components/ui/Button/Button';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useStakingMetrics } from '@/hooks/staking/useStaking';
import { useStakingTvlAndTotalClaimed } from '@/hooks/staking/useStakingHistory';
import { useAddTokens } from '@/hooks/useAddTokens';
import { useLogger } from '@/hooks/useLogger';
import { useSavBalance, useSavRBalance, useTokenBalanceHistory } from '@/hooks/useTokenBalance';
import { bigNumberToString, getReadableAmount } from '@/utils/number';

import { BalanceHistoryChart } from './BalanceChart';
import { TvlAndClaimedChart } from './TvlAndClaimedChart';

const buttonProps = {
  padding: { md: '15px' },
  mt: { sm: '20px', md: '10px', lg: '15px', xl: '10px', '2xl': '12px' },
  size: { sm: 'xl', xl: 'md', '2xl': 'xl' },
  fontSize: { xl: '12px', '2xl': 'unset' },
  width: { sm: '100%', lg: '200px', xl: '100%' },
};

export const WalletPortfolio = () => {
  const navigate = useNavigate();
  const logger = useLogger({
    event: 'dashboard',
    category: 'elements',
    action: 'button_click',
    buttonLocation: 'up',
    actionGroup: 'interactions',
  });
  const { address, isConnected } = useAccount();
  const { addSAV, addSAVR } = useAddTokens();

  const { data: savBalance } = useSavBalance(address);
  const { data: savrBalance } = useSavRBalance(address);

  const { balanceHistory } = useTokenBalanceHistory();

  const { tvlSavSavr, totalClaimed } = useStakingMetrics();

  const { tvlAndClaimedData, stakingClaimsHistory, stakesHistory } = useStakingTvlAndTotalClaimed();
  const isTvlChartLoaded = Boolean(stakingClaimsHistory.length && stakesHistory.length);
  const chartRef = useRef(null);
  const imageRef = useRef(null);

  const bp = useBreakpoint({ ssr: false });
  const isSmOrXl = ['sm', 'xl'].includes(bp);

  const handleNavigateToExchange = useCallback(() => {
    logger({ label: 'buy_sav' });
    navigate('/exchange');
  }, [logger, navigate]);

  const handleAddSav = useCallback(() => {
    logger({ label: 'add_to_wallet', content: 'sav' });
    addSAV();
  }, [logger, addSAV]);
  const handleAddSavR = useCallback(() => {
    logger({ label: 'add_to_wallet', content: 'savr' });
    addSAVR();
  }, [logger, addSAVR]);

  return (
    <Flex alignItems={{ sm: 'stretch', xl: 'center' }} direction={{ sm: 'column', xl: 'row' }}>
      <Box flexGrow="1" mb={{ sm: '45px', xl: 'unset' }}>
        <Text textStyle="h1" as="h1" fontSize={{ sm: '38px', xl: '52px', '2xl': '90px' }}>
          DASHBOARD
        </Text>
        <Text textStyle="textMedium" fontSize={{ sm: '16px', xl: '18px', '2xl': '32px' }} mt="10px">
          All information about your assets
        </Text>
        <Flex
          alignItems="center"
          textStyle="textMedium"
          mt={{ sm: '30px', xl: '50px', '2xl': '80px' }}
          fontSize={{ sm: '16px', md: '18px', '2xl': '26px' }}
          fontWeight={{ sm: '600', md: '700', xl: '500' }}
        >
          <Text mr="40px">SAV = 1 USDT</Text>
          <Text>SAVR = 1 USDT</Text>
        </Flex>
        <Button mt="30px" width={{ sm: '100%', xl: 'unset' }} onClick={handleNavigateToExchange}>
          <Text mr="12px">Buy SAV</Text>
          <BoxIcon />
        </Button>
      </Box>

      <Box
        background="rgba(0, 0, 0, 0.2)"
        borderRadius="md"
        padding={{ sm: '30px 10px', md: '24px 10px', lg: '30px 20px', xl: '20px', '2xl': '30px' }}
        flexGrow="1"
        maxW={{ sm: '100%', xl: '380px', '2xl': '510px' }}
      >
        <Text
          fontSize={{ sm: '18px', xl: '22px', '2xl': '26px' }}
          fontWeight={{ sm: '400', xl: '500' }}
          mb="20px"
          textTransform="uppercase"
        >
          {isConnected ? 'Wallet portfolio' : 'Historical rates'}
        </Text>

        {isConnected ? (
          <>
            <Box h="220px" overflow="hidden">
              {balanceHistory.length ? (
                <BalanceHistoryChart data={balanceHistory} />
              ) : (
                <Box color="bgGreen.600" height="100%">
                  <PuzzlesIcon height="100%" />
                </Box>
              )}
            </Box>
            <Flex mt="15px" justifyContent="space-between" direction={{ sm: 'column', md: 'row' }}>
              <Flex flexWrap="wrap" width={{ sm: '100%', md: '48%' }}>
                <Flex alignItems="baseline" color="green.400" textStyle="textSansBold" width="100%">
                  <Text
                    mr="1"
                    textStyle="textMedium"
                    minWidth="0"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    overflow="hidden"
                  >
                    {savBalance ? bigNumberToString(savBalance) : '---'}
                  </Text>
                  SAV
                </Flex>
                <Button {...buttonProps} onClick={handleAddSav}>
                  <Text mr="12px">Add to wallet</Text>
                  <PlusIcon />
                </Button>
              </Flex>
              <Flex
                flexWrap="wrap"
                width={{ sm: '100%', md: '48%' }}
                mt={{ sm: '30px', md: 'unset' }}
              >
                <Flex alignItems="baseline" color="blue" textStyle="textSansBold" width="100%">
                  <Text
                    mr="1"
                    textStyle="textMedium"
                    minWidth="0"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    overflow="hidden"
                  >
                    {savrBalance ? bigNumberToString(savrBalance) : '---'}
                  </Text>
                  SAVR
                </Flex>
                <Button {...buttonProps} onClick={handleAddSavR}>
                  <Text mr="12px">Add to wallet</Text>
                  <PlusIcon />
                </Button>
              </Flex>
            </Flex>
          </>
        ) : (
          <>
            <Box
              height={{ sm: '146px', md: '215px', lg: '273px', xl: '207px', '2xl': '220px' }}
              overflow="hidden"
            >
              <SwitchTransition>
                <CSSTransition
                  key={isTvlChartLoaded ? 'chart' : 'image'}
                  timeout={250}
                  classNames="fade-transition"
                  nodeRef={isTvlChartLoaded ? chartRef : imageRef}
                  in
                  appear
                >
                  {isTvlChartLoaded ? (
                    <Box ref={chartRef} height="100%" overflow="hidden">
                      <TvlAndClaimedChart data={tvlAndClaimedData} />
                    </Box>
                  ) : (
                    <Box
                      ref={imageRef}
                      className="puzzle-animation"
                      height={isSmOrXl ? '100%' : 'unset'}
                    >
                      <PuzzlesIcon height="100%" width="100%" />
                    </Box>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </Box>
            <Flex
              gap={2}
              direction={{ sm: 'column', md: 'row' }}
              margin={{ sm: '12px 0 20px', md: '15px 0', '2xl': '20px 0' }}
              textStyle={{ sm: 'textSansSmall', '2xl': 'textSansBold' }}
            >
              <Flex alignItems="baseline" width="50%" whiteSpace="nowrap">
                <Text mr="8px">Total Value Locked</Text>
                <Text fontSize="18px" fontWeight="500">
                  {getReadableAmount(tvlSavSavr || 0, { precision: 2 })}
                </Text>
              </Flex>
              <Flex
                alignItems="baseline"
                width="50%"
                justifyContent={{ sm: 'flex-start', xl: 'flex-end' }}
                color="yellow.200"
              >
                <Text mr="8px">Total Claimed</Text>
                <Text fontSize="18px" fontWeight="500">
                  {getReadableAmount(totalClaimed || 0, { precision: 2 })}
                </Text>
              </Flex>
            </Flex>

            <ConnectWalletButton location="up" width={{ sm: '100%', xl: 'unset' }} size="lg" />
          </>
        )}
      </Box>
    </Flex>
  );
};
