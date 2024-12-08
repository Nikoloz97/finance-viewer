export interface IParsedStatementData {
  brokerageName: string;
  investmentType: string;
  investmentSubtype: string;
  startDate: Date;
  startBalance: number;
  endDate: Date;
  endBalance: number;
  depositAmount: number;
  withdrawalAmount: number;
}

export interface IInvestmentReport {
  userId: string;
  startBalance: number;
  startBalanceDate: Date;
  endBalance: number;
  endBalanceDate: Date;
  investmentType: string;
  investmentSubtype: string;
  depositAmount: number;
  withdrawalAmount: number;
  brokerageName: number;
}
