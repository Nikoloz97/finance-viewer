import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  IInvestmentChartConfig,
  IInvestmentChartData,
  ISelectedInvestment,
} from "../Models/Investments";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ShadcnComponents/Chart";

interface InvestmentDisplayProps {
  selectedInvestmentsChartData: IInvestmentChartData[] | undefined;
  selectedInvestmentChartConfig: IInvestmentChartConfig | undefined;
  selectedInvestment: ISelectedInvestment | null;
}

const InvestmentDisplay = ({
  selectedInvestmentsChartData,
  selectedInvestmentChartConfig,
  selectedInvestment,
}: InvestmentDisplayProps) => {
  const monthlyTotals = selectedInvestmentsChartData?.map((chartData) => {
    let sum = 0;
    for (const key in chartData) {
      const value = chartData[key];
      if (typeof value === "number") {
        sum += value;
      }
    }
    return sum;
  });

  const highestSum = monthlyTotals ? Math.max(...monthlyTotals) : 0;

  return (
    <div>
      <div style={{ marginLeft: "2.2em", marginBottom: "1em" }}>
        <h1 style={{ fontWeight: "500" }}>
          {selectedInvestment?.brokerageName
            ? selectedInvestment?.brokerageName
            : "All Investments"}
        </h1>
        <p style={{ fontWeight: "100", fontSize: "0.7em", opacity: "0.8" }}>
          {selectedInvestment?.type}
          {selectedInvestment?.subtype
            ? ` (${selectedInvestment?.subtype})`
            : ""}
        </p>

        {selectedInvestmentsChartData && (
          <h3
            style={{ fontWeight: "100", opacity: "0.8", marginTop: "0" }}
          >{`${selectedInvestmentsChartData[0].month} - ${selectedInvestmentsChartData[selectedInvestmentsChartData.length - 1].month}`}</h3>
        )}
      </div>
      {selectedInvestmentChartConfig && (
        <ChartContainer config={selectedInvestmentChartConfig}>
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
              domain={[0, highestSum + 2000]}
            />
            {/* TODO: fix the white background this gives (or just get rid of it) */}
            {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(selectedInvestmentChartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={`var(--color-${key})`}
              />
            ))}
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default InvestmentDisplay;
