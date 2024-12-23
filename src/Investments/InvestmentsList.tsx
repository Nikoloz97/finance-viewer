import AddInvestmentCarousel from "./AddInvestmentCarousel";
import { Button } from "../ShadcnComponents/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ShadcnComponents/Card";
import { IInvestmentReport, ISelectedInvestment } from "../Models/Investments";
import { Badge } from "../ShadcnComponents/Badge";

interface InvestmentsListProps {
  handleAllClick: () => void;
  investmentReports: IInvestmentReport[];
  handleInvestmentCardClick: (report: IInvestmentReport) => void;
  selectedInvestment: ISelectedInvestment | null;
}

const InvestmentsList = ({
  handleAllClick,
  investmentReports,
  handleInvestmentCardClick,
  selectedInvestment,
}: InvestmentsListProps) => {
  return (
    <div className="Investments-List-Container">
      <div className="Investment-Filters-Container">
        <h3 className="mb-0">Filter: </h3>
        <Badge className="dark">All</Badge>
        <Badge>Stocks</Badge>
        <Badge>Savings</Badge>
        <Badge>Crypto</Badge>
        <Badge>Bonds</Badge>
        <Badge>Retirement</Badge>
      </div>
      <div className="Investments-List-Rectangle">
        {/* TODO: move carousel component out to investments? Get rid of trigger element in it */}
        <AddInvestmentCarousel />
        <Button
          className={`Add-Investment-Button text-white ${selectedInvestment ? "" : "Selected-Investment-Card"}`}
          onClick={handleAllClick}
        >
          All
        </Button>
        {investmentReports.map((report, index) => (
          <Button
            key={index}
            asChild
            className={`border-none ${selectedInvestment ? (selectedInvestment.investmentId === report._id ? "Selected-Investment-Card" : "") : ""}`}
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
  );
};

export default InvestmentsList;
