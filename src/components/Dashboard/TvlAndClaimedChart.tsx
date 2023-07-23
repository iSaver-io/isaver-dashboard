import { FC, useCallback } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { convertDayToLocalDateString } from '@/utils/time';

type TvlAndClaimedHistory = {
  day: number;
  tvl: number;
  totalClaimed: number;
};

type TvlAndClaimedChartProps = {
  data: TvlAndClaimedHistory[];
};
export const TvlAndClaimedChart: FC<TvlAndClaimedChartProps> = ({ data }) => {
  const tickFormatter = useCallback((day: any) => convertDayToLocalDateString(day), []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={300} height={100} data={data || []}>
        <defs>
          <linearGradient id="colorToken1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(107, 201, 91)" stopOpacity={0.3186} />
            <stop offset="100%" stopColor="rgb(10, 147, 150)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorToken2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(26, 211, 216)" stopOpacity={0.59} />
            <stop offset="100%" stopColor="rgb(10, 147, 150)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis type="number" dataKey="day" hide domain={['dataMin', 'dataMax']} />

        {/* <Tooltip
          contentStyle={{ background: '#193524' }}
          content={<CustomTooltip tickFormatter={tickFormatter} />}
        /> */}

        <Area
          type="monotone"
          dataKey="tvl"
          stroke="#6BC95B"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorToken1)"
          unit="TVL"
        />
        <Area
          type="monotone"
          dataKey="totalClaimed"
          stroke="#1ADCE2"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorToken2)"
          unit="Total Claimed"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
  tickFormatter,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;

  tickFormatter: (day: any) => string;
}) => {
  if (label && active && payload && payload.length) {
    const tvl = payload[0]?.payload?.tvl;
    const totalClaimed = payload[0]?.payload?.totalClaimed;

    return (
      <Box border="1px solid #aaa" borderRadius="4px" background="bgGreen.100" padding="4px 8px">
        <Text>{tickFormatter(label)}</Text>
        <Text fontWeight="600" color="green.400">
          TVL: {tvl} SAV
        </Text>
        <Text fontWeight="600" color="savr">
          Total Claimed: {totalClaimed} SAV
        </Text>
      </Box>
    );
  }

  return null;
};
