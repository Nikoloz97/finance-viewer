import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { IInvestmentReport } from "../Models/Investments";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ShadcnComponents/Chart";

interface InvestmentDisplayProps {
  selectedInvestment: IInvestmentReport | undefined;
}

const InvestmentDisplay = ({ selectedInvestment }: InvestmentDisplayProps) => {
  const chartConfig = {
    vanguard: {
      label: "Vanguard",
      color: "red",
    },
    webull: {
      label: "Webull",
      color: "blue",
    },
    fidelity: {
      label: "Fidelity",
      color: "green",
    },
  } satisfies ChartConfig;

  // TODO: export this out in reusable file?
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // TODO: make this a global variable?
  const date = new Date();

  // TODO: months should be based on latest investment report
  // TODO: make note that for quarterly statements, beginning val = every month except last and ending val = last month
  // TODO: also make note that we want user to hard fill missing certain stock values if statements only cover a portion of them for a given month
  // E.g. had to hard-fill fidelity value since they do quarterly statement and last period ended in september

  const chartData = [
    // Aug
    {
      month: months[date.getMonth() - 4],
      vanguard: 2949.73,
      webull: 7598.76,
      fidelity: 2622.77,
    },
    // Sept
    {
      month: months[date.getMonth() - 3],
      vanguard: 3132.65,
      webull: 7892.66,
      fidelity: 2775.38,
    },
    // October
    {
      month: months[date.getMonth() - 2],
      vanguard: 3118.64,
      webull: 7982.76,
      fidelity: 2755.12,
    },
  ];

  return (
    <div style={{ width: "50%" }}>
      <p style={{ textAlign: "center" }}>Total Investments</p>
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
          <YAxis dataKey="webull" tickLine={false} tickMargin={10} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="vanguard" fill="var(--color-vanguard)" stroke="red" />
          <Line dataKey="webull" fill="var(--color-webull)" stroke="blue" />
          <Line
            dataKey="fidelity"
            fill="var(--color-fidelity)"
            stroke="green"
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default InvestmentDisplay;
