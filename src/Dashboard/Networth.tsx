"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ShadcnComponents/Chart";
import { Monitor, Smartphone } from "lucide-react";

const Networth = () => {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      icon: Monitor,
      color: "blue",
    },
    mobile: {
      label: "Mobile",
      icon: Smartphone,
      color: "pink",
    },
  } satisfies ChartConfig;

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  return (
    <div style={{ width: "50%" }}>
      <p style={{ textAlign: "center" }}>Total Net Worth</p>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis dataKey="desktop" tickLine={false} tickMargin={10} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="desktop" fill="var(--color-desktop)" stroke="blue" />
          <Line dataKey="mobile" fill="var(--color-mobile)" stroke="pink" />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default Networth;
