import { Button } from "../ShadcnComponents/Button";
import { Card, CardDescription, CardTitle } from "../ShadcnComponents/Card";
import { CardHeader } from "semantic-ui-react";
import { Badge } from "../ShadcnComponents/Badge";
import AddInvestmentDialog from "./AddInvestmentDialog";

const Investments = () => {
  const mockInvestmentReports = [
    {
      investmentReportId: 1,
      userId: 1,
      brokerageName: "Webull",
      investmentType: "Stocks",
      investmentSubtype: "Individual",
      balance: 7972.64,
      balanceDate: "10-31-2024",
    },
    {
      investmentReportId: 2,
      userId: 1,
      brokerageName: "Vanguard",
      investmentType: "Stocks",
      investmentSubtype: "ETF",
      balance: 3118.64,
      balanceDate: "10-31-2024",
    },
    {
      investmentReportId: 3,
      userId: 1,
      brokerageName: "Fidelity",
      investmentType: "Stocks",
      investmentSubtype: "ETF",
      balance: 2775.38,
      balanceDate: "09-30-2024",
    },
  ];

  const mockInvestmentReportDetails = [
    {
      investmentReportDetailId: 1,
      investmentReportId: 1,
      depositAmount: 0,
      withdrawalAmount: 0,
      dividends: 2.07,
    },
    {
      investmentReportDetailId: 2,
      investmentReportId: 2,
      depositAmount: 0,
      withdrawalAmount: 0,
      dividends: 9.63,
    },
    {
      investmentReportDetailId: 3,
      investmentReportId: 3,
      depositAmount: 0,
      withdrawalAmount: 0,
      dividends: null,
    },
  ];

  const handleInvestmentCardClick = () => {
    console.log("hello");
  };

  return (
    <div className="Investments-Page">
      <div className="Investments-List-Container">
        <div className="Investment-Types-Container">
          <Badge>Stocks</Badge>
          <Badge>Savings</Badge>
          <Badge>Crypto</Badge>
          <Badge>Bonds</Badge>
          <Badge>Retirement</Badge>
        </div>
        <div className="Investments-List-Rectangle">
          <AddInvestmentDialog />
          {mockInvestmentReports.map((report) => (
            <Button
              asChild
              className="border-none"
              onClick={handleInvestmentCardClick}
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
      <div className="Investment-Display-Container">Investment Display</div>
    </div>
  );
};

export default Investments;
