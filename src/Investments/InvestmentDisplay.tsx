import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { IInvestmentChartData } from "../Models/Investments";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ShadcnComponents/Chart";

interface InvestmentDisplayProps {
  selectedInvestmentsChartData: IInvestmentChartData[] | undefined;
  selectedInvestmentName: string | null;
}

const InvestmentDisplay = ({
  selectedInvestmentsChartData,
  selectedInvestmentName,
}: InvestmentDisplayProps) => {
  // TODO: give user ability to build this out as they add investments
  const chartConfig = {
    Vanguard: {
      label: "Vanguard",
      color: "#eb3434",
    },
    Webull: {
      label: "Webull",
      color: "#345feb",
    },
    Fidelity: {
      label: "Fidelity",
      color: "#34eb3a",
    },
  } satisfies ChartConfig;

  return (
    <div style={{ width: "50%" }}>
      <div style={{ marginLeft: "2.2em", marginBottom: "1em" }}>
        <h1 style={{ fontWeight: "500" }}>
          {selectedInvestmentName ? selectedInvestmentName : "All Investments"}
        </h1>
        {/* TODO: fix this eventually */}
        {/* <h3
          style={{ fontWeight: "100", opacity: "0.8", marginTop: "0" }}
        >{`${chartData[0].month} - ${chartData[chartData.length - 1].month}`}</h3> */}
      </div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={selectedInvestmentsChartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            type="number"
            tickLine={false}
            tickMargin={10}
            domain={[0, 16000]}
          />
          {/* TODO: fix the white background this gives (or just get rid of it) */}
          {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
          <ChartLegend content={<ChartLegendContent />} />
          {Object.keys(chartConfig).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={`var(--color-${key})`}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default InvestmentDisplay;
