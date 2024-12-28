import { Button } from "../ShadcnComponents/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ShadcnComponents/Card";
import { IInvestmentReport, ISelectedInvestment } from "../Models/Investments";
import { Badge } from "../ShadcnComponents/Badge";
import { Plus } from "lucide-react";

interface InvestmentsListProps {
  handleAllClick: () => void;
  investmentReports: IInvestmentReport[];
  handleInvestmentCardClick: (report: IInvestmentReport) => void;
  selectedInvestment: ISelectedInvestment | null;
  setIsInvestmentAddDialogCarouselOpen: (isOpen: boolean) => void;
}

const InvestmentsList = ({
  handleAllClick,
  investmentReports,
  handleInvestmentCardClick,
  selectedInvestment,
  setIsInvestmentAddDialogCarouselOpen,
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
        <Button
          onClick={() => setIsInvestmentAddDialogCarouselOpen(true)}
          className="dark Add-Investment-Button text-white"
        >
          <Plus />
        </Button>
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
