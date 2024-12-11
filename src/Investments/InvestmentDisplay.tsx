import { IInvestmentReport } from "../Models/Investments";

interface InvestmentDisplayProps {
  selectedInvestment: IInvestmentReport | undefined;
}

const InvestmentDisplay = ({ selectedInvestment }: InvestmentDisplayProps) => {
  return <div>Investment Display</div>;
};

export default InvestmentDisplay;
