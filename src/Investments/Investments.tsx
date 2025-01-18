/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import {
  IFlattenedInvestmentStatement,
  IInvestmentChartData,
  IInvestment,
  INewInvestment,
  INewStatement,
  ISelectedInvestment,
  IInvestmentChartConfig,
} from "../Models/Investments";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";
import InvestmentDisplay from "./InvestmentDisplay";
import InvestmentsList from "./InvestmentsList";
import EditStatementDialog from "./EditStatementDialog";
import { Button } from "../ShadcnComponents/Button";
import AddInvestmentDialogCarousel from "./AddDialogCarousel";
import AddStatementDialogCarousel from "./AddDialogCarousel";
import { InvestmentsTable } from "../Tables/InvestmentsTable";
import { Skeleton } from "../ShadcnComponents/Skeleton";
import CustomAlertDialog from "../Utils/CustomAlertDialog";

const Investments = () => {
  const { user } = UseContextCheck();

  const [investments, setInvestments] = useState<IInvestment[]>([]);
  const [fetchedInvestmentChartData, setFetchedInvestmentChartData] = useState<
    IInvestmentChartData[]
  >([]);

  const [selectedInvestmentChartData, setSelectedInvestmentChartData] =
    useState<IInvestmentChartData[]>();

  const [selectedInvestmentChartConfig, setSelectedInvestmentChartConfig] =
    useState<IInvestmentChartConfig>();

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

  const [areInvestmentsLoading, setAreInvestmentsLoading] = useState(true);

  let flattenedInvestmentStatements: IFlattenedInvestmentStatement[] | null =
    null;

  // TODO: This flattening should be done from the original fetch (via $unwind operator)
  if (selectedInvestment) {
    flattenedInvestmentStatements = investments
      .filter(
        (investment) => investment._id === selectedInvestment.investmentId
      )
      .flatMap((investment) =>
        investment.statements.map((statement) => ({
          investmentId: investment._id,
          brokerageName: investment.brokerageName,
          type: investment.type,
          subtype: investment.subtype,
          ...statement,
        }))
      );
  } else {
    flattenedInvestmentStatements = investments.flatMap((investment) =>
      investment.statements.map((statement) => ({
        investmentId: investment._id,
        brokerageName: investment.brokerageName,
        type: investment.type,
        subtype: investment.subtype,
        ...statement,
      }))
    );
  }

  const fetchInvestments = async () => {
    setAreInvestmentsLoading(true);
    const response = await fetch(
      `/investments/investments?userId=${user?._id}`
    );
    if (!response.ok) {
      setAreInvestmentsLoading(false);
      throw new Error("Failed to fetch investments");
    } else {
      const investments: IInvestment[] = await response.json();
      setInvestments(investments);
      setSelectedInvestment(null);

      const chartConfig = investments.reduce<IInvestmentChartConfig>(
        (acc, investment) => {
          const { brokerageName, color } = investment;
          acc[brokerageName] = {
            label: brokerageName,
            color: color,
          };
          return acc;
        },
        {}
      );

      setSelectedInvestmentChartConfig(chartConfig);
      setAreInvestmentsLoading(false);
    }
  };

  const handleAddInvestment = async (
    newInvestmentData: INewInvestment | INewStatement
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
      fetchInvestments();
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

  const handleInvestmentDelete = async (investmentId: string | undefined) => {
    const response = await fetch(
      `/investments/investment?investmentId=${investmentId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete investment");
    } else {
      fetchInvestments();
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
        fetchInvestments();
      }
    }
  };

  const handleInvestmentCardClick = (investment: IInvestment) => {
    const filteredInvestmentChartData = fetchedInvestmentChartData?.map(
      (chartData) => {
        return {
          month: chartData.month,
          [investment.brokerageName]: chartData[investment.brokerageName],
        };
      }
    );
    setSelectedInvestmentChartData(filteredInvestmentChartData);
    setSelectedInvestment({
      investmentId: investment._id,
      brokerageName: investment.brokerageName,
      type: investment.type,
      subtype: investment.subtype,
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
      fetchInvestments();
    } else {
      console.log("response was not okay");
    }
  };

  const handleAddStatement = async (
    newStatementData: INewStatement | INewInvestment
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
      fetchInvestments();
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
    fetchInvestments();
  }, []);

  useEffect(() => {
    if (investments.length) {
      fetchInvestmentChartData();
    }
  }, [investments]);

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

      <div className="Investments-List-Container">
        {areInvestmentsLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <InvestmentsList
            handleAllClick={handleAllClick}
            investments={investments}
            handleInvestmentCardClick={handleInvestmentCardClick}
            selectedInvestment={selectedInvestment}
            setIsInvestmentAddDialogCarouselOpen={
              setIsInvestmentAddDialogCarouselOpen
            }
          />
        )}
      </div>

      <div className="Investment-Display-Container">
        <div className="Investment-Add-Delete-Table-Container">
          {areInvestmentsLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <>
              <div className="Investments-Add-Delete-Container">
                <CustomAlertDialog
                  triggerText="Delete Investment"
                  title="Delete Investment?"
                  description="This action cannot be undone"
                  isTriggerDisabled={selectedInvestment === null}
                  triggerStyle={{
                    width: "40%",
                    height: "5em",
                    fontSize: "0.5em",
                  }}
                  onContinueClick={() =>
                    handleInvestmentDelete(selectedInvestment?.investmentId)
                  }
                />
                <Button
                  style={{ width: "40%", height: "5em", fontSize: "0.5em" }}
                  disabled={selectedInvestment === null}
                  onClick={() => setIsStatementAddDialogCarouselOpen(true)}
                >
                  Add Statement
                </Button>
              </div>
              <div className="Investments-Table-Container">
                {investments.length && (
                  <InvestmentsTable
                    data={flattenedInvestmentStatements}
                    handleStatementEdit={handleStatementEdit}
                    handleStatementDelete={handleStatementDelete}
                  />
                )}
              </div>
            </>
          )}
        </div>

        <div className="Investments-Display-Container">
          {areInvestmentsLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <InvestmentDisplay
              selectedInvestmentsChartData={selectedInvestmentChartData}
              selectedInvestmentChartConfig={selectedInvestmentChartConfig}
              selectedInvestment={selectedInvestment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Investments;
