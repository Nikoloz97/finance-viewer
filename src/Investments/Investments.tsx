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
import { areSimpleTypeObjectsEqual } from "../Utils/General";

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

  let flattenedInvestmentStatements: IFlattenedInvestmentStatement[] | null =
    null;

  if (selectedInvestment) {
    flattenedInvestmentStatements = investmentReports
      .filter((report) =>
        areSimpleTypeObjectsEqual(
          {
            brokerageName: report.brokerageName,
            investmentType: report.investmentType,
            investmentSubtype: report.investmentSubtype,
          },
          {
            brokerageName: selectedInvestment.brokerageName,
            investmentType: selectedInvestment.investmentType,
            investmentSubtype: selectedInvestment.investmentSubtype,
          }
        )
      )
      .flatMap((report) =>
        report.statements.map((statement) => ({
          brokerageName: report.brokerageName,
          investmentType: report.investmentType,
          investmentSubtype: report.investmentSubtype,
          ...statement,
        }))
      );
  } else {
    flattenedInvestmentStatements = investmentReports.flatMap((report) =>
      report.statements.map((statement) => ({
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
      brokerageName: report.brokerageName,
      investmentType: report.investmentType,
      investmentSubtype: report.investmentSubtype,
    });
  };

  const handleAllClick = () => {
    setSelectedInvestmentChartData(fetchedInvestmentChartData);
    setSelectedInvestment(null);
  };

  return (
    <div className="Investments-Page">
      <InvestmentsList
        handleAllClick={handleAllClick}
        investmentReports={investmentReports}
        handleInvestmentCardClick={handleInvestmentCardClick}
        selectedInvestment={selectedInvestment}
      />
      <div className="Investment-Display-Container">
        {investmentReports.length && (
          <InvestmentGrid statements={flattenedInvestmentStatements} />
        )}
        <InvestmentDisplay
          selectedInvestmentsChartData={selectedInvestmentChartData}
          selectedInvestment={selectedInvestment}
        />
      </div>
    </div>
  );
};

export default Investments;
