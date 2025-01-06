/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import {
  IFlattenedInvestmentStatement,
  IInvestmentChartData,
  IInvestmentReport,
  INewInvestmentReport,
  INewStatement,
  ISelectedInvestment,
} from "../Models/Investments";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";
import InvestmentDisplay from "./InvestmentDisplay";
import InvestmentsList from "./InvestmentsList";
import EditStatementDialog from "./EditStatementDialog";
import { Button } from "../ShadcnComponents/Button";
import AddInvestmentDialogCarousel from "./AddDialogCarousel";
import AddStatementDialogCarousel from "./AddDialogCarousel";
import { InvestmentsTable } from "../Tables/InvestmentsTable";

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

  const [
    isInvestmentAddDialogCarouselOpen,
    setIsInvestmentAddDialogCarouselOpen,
  ] = useState<boolean>(false);

  const [
    isStatementAddDialogCarouselOpen,
    setIsStatementAddDialogCarouselOpen,
  ] = useState<boolean>(false);

  let flattenedInvestmentStatements: IFlattenedInvestmentStatement[] | null =
    null;

  // TODO: This flattening should be done from the original fetch (via $unwind operator)
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
    newInvestmentData: INewInvestmentReport | INewStatement
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
      setIsInvestmentAddDialogCarouselOpen(false);
    } else {
      if (responseJson.message) {
        console.log(responseJson.message);
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
        throw new Error("Failed to delete investment");
      } else {
        fetchInvestmentReports();
      }
    }
  };

  const handleStatementDelete = async (
    investmentId: string | undefined,
    statementId: string | undefined
  ) => {
    if (confirm("Delete statement? This action cannot be undone")) {
      const response = await fetch(
        `/investments/statement?investmentId=${investmentId}&statementId=${statementId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete statement");
      } else {
        fetchInvestmentReports();
      }
    }
  };

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

  const handleAddStatement = async (
    newStatementData: INewStatement | INewInvestmentReport
  ) => {
    if (!selectedInvestment) {
      console.error("No investment was selected");
      return;
    }
    const newStatementDataWithInvestmentId = {
      ...newStatementData,
      investmentId: selectedInvestment.investmentId,
    };

    const response = await fetch("/investments/addStatement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStatementDataWithInvestmentId),
    });

    const responseJson = await response.json();

    if (response.ok) {
      fetchInvestmentReports();
      setIsStatementAddDialogCarouselOpen(false);
    } else {
      // Specific message
      if (responseJson.message) {
        // Non-specific message
      } else {
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
    if (investmentReports.length) {
      fetchInvestmentChartData();
    }
  }, [investmentReports]);

  return (
    <div className="Investments-Page">
      <AddStatementDialogCarousel
        type="Statement"
        isAddDialogCarouselOpen={isStatementAddDialogCarouselOpen}
        setIsAddDialogCarouselOpen={setIsStatementAddDialogCarouselOpen}
        handleAdd={handleAddStatement}
        header="Add Statement"
        subheader="Please follow along steps for adding a statement:"
      />
      <AddInvestmentDialogCarousel
        type="Investment"
        isAddDialogCarouselOpen={isInvestmentAddDialogCarouselOpen}
        setIsAddDialogCarouselOpen={setIsInvestmentAddDialogCarouselOpen}
        handleAdd={handleAddInvestment}
        header="Add Investment"
        subheader="Please follow along steps for adding an investment:"
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
        setIsInvestmentAddDialogCarouselOpen={
          setIsInvestmentAddDialogCarouselOpen
        }
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
            onClick={() => setIsStatementAddDialogCarouselOpen(true)}
          >
            Add Statement
          </Button>

          {investmentReports.length && (
            <InvestmentsTable
              data={flattenedInvestmentStatements}
              handleStatementEdit={handleStatementEdit}
              handleStatementDelete={handleStatementDelete}
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
