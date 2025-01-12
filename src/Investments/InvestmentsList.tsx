import { Button } from "../ShadcnComponents/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ShadcnComponents/Card";
import { IInvestment, ISelectedInvestment } from "../Models/Investments";
import { Badge } from "../ShadcnComponents/Badge";
import { Plus } from "lucide-react";
import ComingSoonOverlay from "../Utils/ComingSoonOverlay/ComingSoonOverlay";
import { useState } from "react";
import { Skeleton } from "../ShadcnComponents/Skeleton";

interface InvestmentsListProps {
  handleAllClick: () => void;
  investments: IInvestment[];
  handleInvestmentCardClick: (investment: IInvestment) => void;
  selectedInvestment: ISelectedInvestment | null;
  setIsInvestmentAddDialogCarouselOpen: (isOpen: boolean) => void;
  areInvestmentsLoading: boolean;
}

const InvestmentsList = ({
  handleAllClick,
  investments,
  handleInvestmentCardClick,
  selectedInvestment,
  setIsInvestmentAddDialogCarouselOpen,
  areInvestmentsLoading,
}: InvestmentsListProps) => {
  return (
    <div className="Investments-List-Container">
      <ComingSoonOverlay
        containerStyle={{ width: "60%", padding: "0.3em" }}
        overlayTextStyle={{ fontSize: "1em" }}
      >
        <div className="Investment-Filters-Container">
          <h3 className="mb-0">Filter: </h3>
          <Badge className="dark">All</Badge>
          <Badge>Stocks</Badge>
          <Badge>Savings</Badge>
          <Badge>Crypto</Badge>
          <Badge>Bonds</Badge>
          <Badge>Retirement</Badge>
        </div>
      </ComingSoonOverlay>

      {areInvestmentsLoading ? (
        <div className="Investments-List-Rectangle">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
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
          {investments.map((investment, index) => (
            <Button
              key={index}
              asChild
              className={`border-none ${selectedInvestment ? (selectedInvestment.investmentId === investment._id ? "Selected-Investment-Card" : "") : ""}`}
              onClick={() => handleInvestmentCardClick(investment)}
            >
              <Card className="Investment-Card">
                <CardHeader>
                  <CardTitle>{investment.brokerageName}</CardTitle>
                  <CardDescription>{`${investment.type} ${investment.subtype ? `(${investment.subtype})` : ""}`}</CardDescription>
                </CardHeader>
              </Card>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestmentsList;
