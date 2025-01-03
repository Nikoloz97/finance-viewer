import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  IInvestmentChartData,
  ISelectedInvestment,
} from "../Models/Investments";
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
  selectedInvestment: ISelectedInvestment | null;
}

const InvestmentDisplay = ({
  selectedInvestmentsChartData,
  selectedInvestment,
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
    <div>
      <div style={{ marginLeft: "2.2em", marginBottom: "1em" }}>
        <h1 style={{ fontWeight: "500" }}>
          {selectedInvestment?.brokerageName
            ? selectedInvestment?.brokerageName
            : "All Investments"}
        </h1>
        <p style={{ fontWeight: "100", fontSize: "0.7em", opacity: "0.8" }}>
          {selectedInvestment?.investmentType}
          {selectedInvestment?.investmentSubtype
            ? ` (${selectedInvestment?.investmentSubtype})`
            : ""}
        </p>

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
