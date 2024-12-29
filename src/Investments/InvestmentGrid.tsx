import { IFlattenedInvestmentStatement } from "../Models/Investments";
import { InvestmentsTable } from "../Tables/InvestmentsTable";

interface InvestmentGridProps {
  statements: IFlattenedInvestmentStatement[];
  handleStatementEdit: (
    updatedStatement: IFlattenedInvestmentStatement
  ) => void;
  handleStatementDelete: (investmentId: string, statementId: string) => void;
}

const InvestmentGrid = ({
  statements,
  handleStatementEdit,
  handleStatementDelete,
}: InvestmentGridProps) => {
  return (
    <div className="text-center">
      <InvestmentsTable
        data={statements}
        handleStatementEdit={handleStatementEdit}
        handleStatementDelete={handleStatementDelete}
      />
    </div>
  );
};

export default InvestmentGrid;
