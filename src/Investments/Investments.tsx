import { useEffect, useState } from "react";
import {
  IFlattenedInvestmentStatement,
  IInvestmentChartData,
  IInvestmentReport,
  ISelectedInvestment,
} from "../Models/Investments";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";
import InvestmentDisplay from "./InvestmentDisplay";
import InvestmentsList from "./InvestmentsList";
import InvestmentGrid from "./InvestmentGrid";
import EditStatementDialog from "./EditStatementDialog";

const Investments = () => {
  const { user } = UseContextCheck();

  const [investmentReports, setInvestmentReports] = useState<
    IInvestmentReport[]
  >([]);
  const [fetchedInvestmentChartData, setFetchedInvestmentChartData] = useState<
    IInvestmentChartData[]
  >([]);

  const [selectedInvestmentChartData, setSelectedInvestmentChartData] =
    useState<IInvestmentChartData[]>();

  const [selectedInvestment, setSelectedInvestment] =
    useState<ISelectedInvestment | null>(null);

  const [isEditStatementDialogOpen, setIsEditStatementDialogOpen] =
    useState<boolean>(false);

  const [selectedStatement, setSelectedStatement] =
    useState<IFlattenedInvestmentStatement | null>(null);

  let flattenedInvestmentStatements: IFlattenedInvestmentStatement[] | null =
    null;

  if (selectedInvestment) {
    flattenedInvestmentStatements = investmentReports
      .filter((report) => report._id === selectedInvestment.investmentId)
      .flatMap((report) =>
        report.statements.map((statement) => ({
          investmentId: report._id,
          brokerageName: report.brokerageName,
          investmentType: report.investmentType,
          investmentSubtype: report.investmentSubtype,
          ...statement,
        }))
      );
  } else {
    flattenedInvestmentStatements = investmentReports.flatMap((report) =>
      report.statements.map((statement) => ({
        investmentId: report._id,
        brokerageName: report.brokerageName,
        investmentType: report.investmentType,
        investmentSubtype: report.investmentSubtype,
        ...statement,
      }))
    );
  }

  const fetchInvestmentReports = async () => {
    try {
      const response = await fetch(
        `/investments/investmentReports?userId=${user?._id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData: IInvestmentReport[] = await response.json();
      setInvestmentReports(jsonData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInvestmentChartData = async () => {
    try {
      const response = await fetch(
        `/investments/investmentChartData?userId=${user?._id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData: IInvestmentChartData[] = await response.json();
      setFetchedInvestmentChartData(jsonData);
      setSelectedInvestmentChartData(jsonData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatementEdit = (
    currentStatement: IFlattenedInvestmentStatement
  ) => {
    setSelectedStatement(currentStatement);
  };

  // TODO: find a way to do this w/out useEffect
  useEffect(() => {
    if (selectedStatement) {
      setIsEditStatementDialogOpen(true);
    }
  }, [selectedStatement]);

  useEffect(() => {
    fetchInvestmentReports();
  }, []);

  useEffect(() => {
    fetchInvestmentChartData();
  }, [investmentReports]);

  const handleInvestmentCardClick = (report: IInvestmentReport) => {
    const filteredInvestmentChartData = fetchedInvestmentChartData?.map(
      (chartData) => {
        return {
          month: chartData.month,
          [report.brokerageName]: chartData[report.brokerageName],
        };
      }
    );
    setSelectedInvestmentChartData(filteredInvestmentChartData);
    setSelectedInvestment({
      investmentId: report._id,
      brokerageName: report.brokerageName,
      investmentType: report.investmentType,
      investmentSubtype: report.investmentSubtype,
    });
  };

  const handleAllClick = () => {
    setSelectedInvestmentChartData(fetchedInvestmentChartData);
    setSelectedInvestment(null);
  };

  const handleEditStatementSubmission = async (
    updatedStatementData: IFlattenedInvestmentStatement
  ) => {
    if (!user) {
      console.error("No user defined");
      return;
    }

    const response = await fetch("/investments/editStatement", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStatementData),
    });

    if (response.ok) {
      console.log(response);
      setSelectedStatement(null);
      fetchInvestmentReports();
    } else {
      console.log("response was not okay");
    }
  };

  return (
    <div className="Investments-Page">
      {selectedStatement && (
        <EditStatementDialog
          handleEditStatementSubmission={handleEditStatementSubmission}
          isEditStatementDialogOpen={isEditStatementDialogOpen}
          setIsEditStatementDialogOpen={setIsEditStatementDialogOpen}
          selectedStatement={selectedStatement}
          setSelectedStatement={setSelectedStatement}
        />
      )}
      <InvestmentsList
        handleAllClick={handleAllClick}
        investmentReports={investmentReports}
        handleInvestmentCardClick={handleInvestmentCardClick}
        selectedInvestment={selectedInvestment}
      />
      <div className="Investment-Display-Container">
        <div className="Investment-Add-Delete-Table-Container">
          {investmentReports.length && (
            <InvestmentGrid
              handleStatementEdit={handleStatementEdit}
              statements={flattenedInvestmentStatements}
            />
          )}
        </div>
        <div style={{ width: "50%" }}>
          <InvestmentDisplay
            selectedInvestmentsChartData={selectedInvestmentChartData}
            selectedInvestment={selectedInvestment}
          />
        </div>
      </div>
    </div>
  );
};

export default Investments;
