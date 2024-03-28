import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { Balance } from '@/components/Balance/Balance';
import { Button } from '@/components/ui/Button/Button';
import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { POWERS_LIST, usePowerControl, usePowersSupply } from '@/hooks/usePowers';

import { MintPowers } from '../common/MintPowers';

export const PowersControl = () => {
  const { supply, isLoading } = usePowersSupply();
  const { mintPowers } = usePowerControl();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AdminSection title="Powers">
      <>
        {isLoading ? <CenteredSpinner /> : null}

        <Button size="sm" onClick={onOpen} mb="20px">
          Mint powers
        </Button>

        {POWERS_LIST.map((power, index) => (
          <Box key={index}>
            <Flex textStyle="text1" mb="10px">
              <Text mr="12px" flex="220px 0 0">
                Minted / Burned Power {power}:
              </Text>
              <Text color="sav">
                {supply &&
                supply[index as 1] &&
                supply[index as 1].totalMinted !== undefined &&
                supply[index as 1].totalBurned !== undefined
                  ? `${supply[index as 1].totalMinted} / ${supply[index as 1].totalBurned}`
                  : '--- / ---'}
              </Text>
            </Flex>

            <Balance
              label={`Circulating supply ${power}:`}
              labelWidth="220px"
              balance={
                !supply[index as 1].isCirculatingSupplyLoading
                  ? supply[index as 1].circulatingSupply
                  : undefined
              }
              minLimit={0}
              isRaw
            />
          </Box>
        ))}

        {isOpen ? <MintPowers onClose={onClose} onSubmit={mintPowers.mutateAsync} /> : null}
      </>
    </AdminSection>
  );
};
