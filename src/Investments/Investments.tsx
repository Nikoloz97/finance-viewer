import React from "react";
import "./Investments.css";

const Investments = () => {
  const mockInvestments = [
    {
      // TODO: is investmentId and userId right way to do this??
      investmentId: 1,
      brokerage: "Webull",
      userId: 1,
      balance: 7972.64,
      balanceDate: "10-31-2024",
      // TODO: put these in investment details table?
      prevBalanceDate: "09-30-2024",
      prevBalanceDiff: 88.03,
      // These are all relative to prev balance
      depositAmount: 0,
      withdrawalAmount: 0,
      dividends: 2.07,
    },
    {
      investmentId: 2,
      brokerage: "Vanguard",
      userId: 1,
      balance: 3118.64,
      balanceDate: "10-31-2024",
      // TODO: put these in investment details table?
      prevBalanceDate: "09-30-2024",
      prevBalanceDiff: -14.01,
      // These are all relative to prev balance
      depositAmount: 0,
      withdrawalAmount: 0,
      dividends: 9.63,
    },
    {
      investmentId: 3,
      brokerage: "Fidelity",
      userId: 1,
      balance: 2775.38,
      balanceDate: "09-30-2024",
      // TODO: put these in investment details table?
      prevBalanceDate: "06-30-2024",
      prevBalanceDiff: 152.61,
      // These are all relative to prev balance
      depositAmount: 0,
      withdrawalAmount: 0,
      dividends: null,
    },
  ];
  return (
    <div className="Investments-Page">
      <div className="Investments-List-Container">
        <div className="Investments-List-Rectangle">Investments List</div>
      </div>
      <div className="Investment-Display-Container">Investment Display</div>
    </div>
  );
};

export default Investments;
