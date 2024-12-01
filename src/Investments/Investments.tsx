import React from "react";
import "./Investments.css";
import { Plus } from "lucide-react";
import { Button } from "../ShadcnComponents/Button";

const Investments = () => {
  const mockInvestmentReports = [
    {
      investmentReportId: 1,
      userId: 1,
      brokerageName: "Webull",
      balance: 7972.64,
      balanceDate: "10-31-2024",
    },
    {
      investmentReportId: 2,
      brokerageName: "Vanguard",
      userId: 1,
      balance: 3118.64,
      balanceDate: "10-31-2024",
    },
    {
      investmentReportId: 3,
      brokerageName: "Fidelity",
      userId: 1,
      balance: 2775.38,
      balanceDate: "09-30-2024",
      prevBalanceDate: "06-30-2024",
      prevBalanceDiff: 152.61,
      depositAmount: 0,
      withdrawalAmount: 0,
      dividends: null,
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

  const handleAddInvestmentClick = () => {
    console.log("hello");
  };

  return (
    <div className="Investments-Page">
      <div className="Investments-List-Container">
        <div className="Investments-List-Rectangle">
          <Button
            style={{
              height: "90%",
              backgroundColor: "var(--secondary-background-color)",
            }}
            onClick={handleAddInvestmentClick}
          >
            <Plus />
          </Button>
        </div>
      </div>
      <div className="Investment-Display-Container">Investment Display</div>
    </div>
  );
};

export default Investments;
