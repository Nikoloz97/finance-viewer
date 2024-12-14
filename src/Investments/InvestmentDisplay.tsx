import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { months } from "../Shared/Months";
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
  selectedInvestments: IInvestmentReport[] | undefined;
}

const InvestmentDisplay = ({ selectedInvestments }: InvestmentDisplayProps) => {
  const chartConfig = {
    vanguard: {
      label: "Vanguard",
      color: "#eb3434",
    },
    webull: {
      label: "Webull",
      color: "#345feb",
    },
    fidelity: {
      label: "Fidelity",
      color: "#34eb3a",
    },
  } satisfies ChartConfig;

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
      <div style={{ marginLeft: "2.2em", marginBottom: "1em" }}>
        <h1 style={{ fontWeight: "500" }}>Total Investments</h1>
        <h3
          style={{ fontWeight: "100", opacity: "0.8", marginTop: "0" }}
        >{`${chartData[0].month} - ${chartData[chartData.length - 1].month}`}</h3>
      </div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            type="number"
            tickLine={false}
            tickMargin={10}
            domain={[10000, 15000]}
          />
          {/* TODO: fix the white background this gives (or just get rid of it) */}
          {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="vanguard"
            stackId="a"
            fill="var(--color-vanguard)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="webull"
            stackId="a"
            fill="var(--color-webull)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="fidelity"
            stackId="a"
            fill="var(--color-fidelity)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default InvestmentDisplay;
