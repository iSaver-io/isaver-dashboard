import { FC, useCallback } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { PERIOD } from '@/hooks/staking/useStakingHistory';
import { chartDateTickFormatter } from '@/utils/chart';

type StakesData = {
  balance: number;
  changeSAVToken: number;
  changeSAVRToken: number;
  day: number;
};
type StakeUnlockChartProps = {
  data?: StakesData[] | null;
  period?: PERIOD;
};
export const StakeUnlockChart: FC<StakeUnlockChartProps> = ({ data, period }) => {
  const tickFormatter = useCallback((day: any) => chartDateTickFormatter(day, period), [period]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={300} height={100} data={data || []}>
        <defs>
          <linearGradient id="colorSAVToken" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(107, 201, 91)" stopOpacity={0.3186} />
            <stop offset="100%" stopColor="rgb(10, 147, 150)" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          type="number"
          dataKey="day"
          domain={[Date.now(), 'dataMax']}
          minTickGap={10}
          tickFormatter={tickFormatter}
          name="Date"
          //   label="Date"
          scale="time"
        />
        <YAxis type="number" dataKey="balance" minTickGap={1} />
        {/* <ReferenceLine y={1000} label="Min" stroke="red" strokeDasharray="3 3" /> */}

        <Tooltip
          contentStyle={{ background: '#193524' }}
          content={<CustomTooltip tickFormatter={tickFormatter} />}
        />

        <Area
          type="monotone"
          dataKey="balance"
          stroke="#6BC95B"
          strokeWidth={2}
          fillOpacity={1}
          dot={{ stroke: '#6BC95B', strokeWidth: 1 }}
          fill="url(#colorSAVToken)"
          unit=" SAV"
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
    const changeSAVToken = payload[0]?.payload?.changeSAVToken;
    const changeSAVRToken = payload[0]?.payload?.changeSAVRToken;
    const isGrow = changeSAVToken > 0 || changeSAVRToken > 0;

    return (
      <Box border="1px solid white" background="bgGreen.100" padding="4px 8px">
        <Text>{tickFormatter(label)}</Text>
        <Text fontWeight="600" color="green.400">
          TVL: {payload[0].value}
        </Text>
        {isGrow ? (
          <>
            <Text fontWeight="500" color="sav" whiteSpace="nowrap">
              Deposit: {changeSAVToken} SAV
            </Text>
            <Text fontWeight="500" color="savr" whiteSpace="nowrap">
              Deposit: {changeSAVRToken} SAVR
            </Text>
          </>
        ) : (
          <Text fontWeight="600" color="red">
            Unlock: {-changeSAVToken} SAV
          </Text>
        )}
      </Box>
    );
  }

  return null;
};
