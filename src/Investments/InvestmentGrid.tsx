import { IFlattenedInvestmentStatement } from "../Models/Investments";
import { InvestmentsColumns } from "../Tables/InvestmentsColumns";
import { InvestmentsTable } from "../Tables/InvestmentsTable";

interface InvestmentGridProps {
  statements: IFlattenedInvestmentStatement[];
}

const InvestmentGrid = ({ statements }: InvestmentGridProps) => {
  return (
    <div className="text-center">
      <InvestmentsTable columns={InvestmentsColumns} data={statements} />
    </div>
  );
};

export default InvestmentGrid;
