import { IFlattenedInvestmentStatement } from "../Models/Investments";
import { InvestmentsTable } from "../Tables/InvestmentsTable";

interface InvestmentGridProps {
  handleStatementEdit: (
    updatedStatement: IFlattenedInvestmentStatement
  ) => void;
  statements: IFlattenedInvestmentStatement[];
}

const InvestmentGrid = ({
  handleStatementEdit,
  statements,
}: InvestmentGridProps) => {
  return (
    <div className="text-center">
      <InvestmentsTable
        handleStatementEdit={handleStatementEdit}
        data={statements}
      />
    </div>
  );
};

export default InvestmentGrid;
