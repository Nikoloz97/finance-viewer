import { Button } from "../ShadcnComponents/Button";
import { Card, CardDescription, CardTitle } from "../ShadcnComponents/Card";
import { CardHeader } from "semantic-ui-react";
import { Badge } from "../ShadcnComponents/Badge";
import AddInvestmentCarousel from "./AddInvestmentCarousel";
import { useEffect, useState } from "react";
import { IInvestmentChartData, IInvestmentReport } from "../Models/Investments";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";
import InvestmentDisplay from "./InvestmentDisplay";
import InvestmentsList from "./InvestmentsList";

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

  useEffect(() => {
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

    fetchInvestmentReports();
  }, []);

  useEffect(() => {
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
  };

  const handleAllClick = () => {
    setSelectedInvestmentChartData(fetchedInvestmentChartData);
  };

  return (
    <div className="Investments-Page">
      <InvestmentsList
        handleAllClick={handleAllClick}
        investmentReports={investmentReports}
        handleInvestmentCardClick={handleInvestmentCardClick}
      />
      <div className="Investment-Display-Container">
        <div style={{ width: "25%" }}>Add to Investment</div>
        <InvestmentDisplay
          selectedInvestmentsChartData={selectedInvestmentChartData}
        />
      </div>
    </div>
  );
};

export default Investments;
