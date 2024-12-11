import { Button } from "../ShadcnComponents/Button";
import { Card, CardDescription, CardTitle } from "../ShadcnComponents/Card";
import { CardHeader } from "semantic-ui-react";
import { Badge } from "../ShadcnComponents/Badge";
import AddInvestmentCarousel from "./AddInvestmentCarousel";
import { useEffect, useState } from "react";
import { IInvestmentReport } from "../Models/Investments";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";
import InvestmentDisplay from "./InvestmentDisplay";

const Investments = () => {
  const { user } = UseContextCheck();

  const [investmentReports, setInvestmentReports] = useState<
    IInvestmentReport[]
  >([]);

  const [selectedInvestment, setSelectedInvestment] =
    useState<IInvestmentReport>();

  useEffect(() => {
    const fetchLatestInvestmentReports = async () => {
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

    fetchLatestInvestmentReports();
  }, []);

  const handleInvestmentCardClick = (report: IInvestmentReport) => {
    setSelectedInvestment(report);
  };

  return (
    <div className="Investments-Page">
      <div className="Investments-List-Container">
        <div className="Investment-Types-Container">
          <h3 className="mb-0">Filter: </h3>
          <Badge className="dark">All</Badge>
          <Badge>Stocks</Badge>
          <Badge>Savings</Badge>
          <Badge>Crypto</Badge>
          <Badge>Bonds</Badge>
          <Badge>Retirement</Badge>
        </div>
        <div className="Investments-List-Rectangle">
          <AddInvestmentCarousel />
          <Button className="Add-Investment-Button text-white">All</Button>
          {investmentReports.map((report, index) => (
            <Button
              key={index}
              asChild
              className="border-none"
              onClick={() => handleInvestmentCardClick(report)}
            >
              <Card className="Investment-Card">
                <CardHeader>
                  <CardTitle>{report.brokerageName}</CardTitle>
                  <CardDescription>{`${report.investmentType} ${report.investmentSubtype ? `(${report.investmentSubtype})` : ""}`}</CardDescription>
                </CardHeader>
              </Card>
            </Button>
          ))}
        </div>
      </div>
      <div className="Investment-Display-Container">
        <InvestmentDisplay selectedInvestment={selectedInvestment} />
      </div>
    </div>
  );
};

export default Investments;
