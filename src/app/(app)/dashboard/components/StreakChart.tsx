'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { day: 'Mon', points: 15 },
  { day: 'Tue', points: 22 },
  { day: 'Wed', points: 18 },
  { day: 'Thu', points: 25 },
  { day: 'Fri', points: 30 },
  { day: 'Sat', points: 20 },
  { day: 'Sun', points: 35 },
];

const chartConfig = {
  points: {
    label: 'Points',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function StreakChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
           <XAxis
            dataKey="day"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--background))' }}
            content={<ChartTooltipContent />}
          />
          <Bar
            dataKey="points"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
