import { Box, Flex, Text } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { Balance } from '@/components/Balance/Balance';
import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { POWERS_LIST, usePowersSupply } from '@/hooks/usePowers';

export const PowersControl = () => {
  const { supply, isLoading } = usePowersSupply();

  return (
    <AdminSection title="Powers">
      <>
        {isLoading ? <CenteredSpinner /> : null}

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
              balance={supply[index as 1].circulatingSupply}
              minLimit={0}
              isRaw
            />
          </Box>
        ))}
      </>
    </AdminSection>
  );
};
