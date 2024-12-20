interface IStatement {
  startBalance: number;
  startBalanceDate: Date;
  endBalance: number;
  endBalanceDate: Date;
  depositAmount: number;
  withdrawalAmount: number;
  startMonth: string;
  endMonth: string;
}

export interface IInvestmentReport {
  userId: string;
  brokerageName: string;
  investmentType: string;
  investmentSubtype: string;
  statements: IStatement[];
}

export interface IInvestmentChartData {
  month: string;
  // TODO: find out why this has to be type string as well
  [brokerageName: string]: number | string;
}

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
