import { FC } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis } from 'recharts';

type TvlAndClaimedHistory = {
  day: number;
  tvl: number;
  totalClaimed: number;
};

type TvlAndClaimedChartProps = {
  data: TvlAndClaimedHistory[];
};
export const TvlAndClaimedChart: FC<TvlAndClaimedChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={300} height={100} data={data || []}>
        <defs>
          <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(255, 255, 255)" stopOpacity={0.59} />
            <stop offset="100%" stopColor="rgb(196, 196, 196)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorTotalClaimed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(214, 216, 115)" stopOpacity={0.59} />
            <stop offset="100%" stopColor="rgb(196, 196, 196)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis type="number" dataKey="day" hide domain={['dataMin', 'dataMax']} />

        <Area
          type="monotone"
          dataKey="tvl"
          stroke="#FFFFFF"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorTvl)"
          unit="TVL"
        />
        <Area
          type="monotone"
          dataKey="totalClaimed"
          stroke="#D6D873"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorTotalClaimed)"
          unit="Total Claimed"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
