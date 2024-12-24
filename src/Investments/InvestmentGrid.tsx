import { IFlattenedInvestmentStatement } from "../Models/Investments";
import { InvestmentsTable } from "../Tables/InvestmentsTable";

interface InvestmentGridProps {
  statements: IFlattenedInvestmentStatement[];
}

const InvestmentGrid = ({ statements }: InvestmentGridProps) => {
  const handleStatementEdit = async (
    updatedStatement: IFlattenedInvestmentStatement
  ) => {
    const response = await fetch("/investments/addInvestment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStatement),
    });

    const responseJson = await response.json();

    if (response.ok) {
      console.log(responseJson);
    } else {
      if (responseJson.message) {
      } else {
      }
    }
  };
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
