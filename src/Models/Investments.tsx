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

export interface IInvestmentChartData {
  month: string;
  // TODO: find out why this has to be type string as well
  [brokerageName: string]: number | string;
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
  startMonth: string;
  endMonth: string;
}
