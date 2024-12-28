/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import {
  IFlattenedInvestmentStatement,
  IInvestmentChartData,
  IInvestmentReport,
  INewInvestmentReport,
  ISelectedInvestment,
} from "../Models/Investments";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";
import InvestmentDisplay from "./InvestmentDisplay";
import InvestmentsList from "./InvestmentsList";
import InvestmentGrid from "./InvestmentGrid";
import EditStatementDialog from "./EditStatementDialog";
import { Button } from "../ShadcnComponents/Button";
import AddDialogCarousel from "./AddDialogCarousel";

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

  const [isAddDialogCarouselOpen, setIsAddDialogCarouselOpen] =
    useState<boolean>(false);

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
    const response = await fetch(
      `/investments/investmentReports?userId=${user?._id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Investment Reports");
    } else {
      const jsonData: IInvestmentReport[] = await response.json();
      setInvestmentReports(jsonData);
      setSelectedInvestment(null);
    }
  };

  const handleAddInvestment = async (
    newInvestmentData: INewInvestmentReport
  ) => {
    if (!user) {
      console.error("No user defined");
      return;
    }
    const newInvestmentDataWithUserId = {
      ...newInvestmentData,
      userId: user._id,
    };

    const response = await fetch("/investments/addInvestment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInvestmentDataWithUserId),
    });

    const responseJson = await response.json();

    if (response.ok) {
      fetchInvestmentReports();
      setIsAddDialogCarouselOpen(false);
    } else {
      // Specific message
      if (responseJson.message) {
        // Non-specific message
      } else {
      }
    }
  };

  const fetchInvestmentChartData = async () => {
    const response = await fetch(
      `/investments/investmentChartData?userId=${user?._id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Investment Chart Data");
    } else {
      const jsonData: IInvestmentChartData[] = await response.json();
      setFetchedInvestmentChartData(jsonData);
      setSelectedInvestmentChartData(jsonData);
    }
  };

  const handleStatementEdit = (
    currentStatement: IFlattenedInvestmentStatement
  ) => {
    setSelectedStatement(currentStatement);
  };

  const handleInvestmentDelete = async (
    investmentReportId: string | undefined
  ) => {
    if (confirm("Delete investment? This action cannot be undone")) {
      const response = await fetch(
        `/investments/investmentReport?investmentReportId=${investmentReportId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the investment");
      } else {
        fetchInvestmentReports();
      }
    }
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

    const response = await fetch("/investments/statement", {
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

  const handleAddStatement = () => {};

  return (
    <div className="Investments-Page">
      <AddDialogCarousel
        isAddDialogCarouselOpen={isAddDialogCarouselOpen}
        setIsAddDialogCarouselOpen={setIsAddDialogCarouselOpen}
        handleAddInvestment={handleAddInvestment}
      />
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
        setIsAddDialogCarouselOpen={setIsAddDialogCarouselOpen}
      />
      <div className="Investment-Display-Container">
        <div className="Investment-Add-Delete-Table-Container">
          <Button
            disabled={selectedInvestment === null}
            onClick={() =>
              handleInvestmentDelete(selectedInvestment?.investmentId)
            }
          >
            Delete Investment
          </Button>
          <Button
            disabled={selectedInvestment === null}
            onClick={() => handleAddStatement()}
          >
            Add Statement
          </Button>

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
