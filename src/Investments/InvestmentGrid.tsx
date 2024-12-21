import { IStatement } from "../Models/Investments";
import { InvestmentsColumns } from "../Tables/InvestmentsColumns";
import { InvestmentsTable } from "../Tables/InvestmentsTable";

interface InvestmentGridProps {
  statements: IStatement[];
}

const InvestmentGrid = ({ statements }: InvestmentGridProps) => {
  return (
    <div>
      <InvestmentsTable columns={InvestmentsColumns} data={statements} />
    </div>
  );
};

export default InvestmentGrid;
