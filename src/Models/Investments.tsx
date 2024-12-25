export interface IInvestmentReport {
  _id: string;
  userId: string;
  brokerageName: string;
  investmentType: string;
  investmentSubtype: string;
  statements: IInvestmentStatement[];
}

export interface IInvestmentStatement {
  statementId: string;
  startBalance: number;
  startBalanceDate: Date;
  endBalance: number;
  endBalanceDate: Date;
  depositAmount: number;
  withdrawalAmount: number;
  startMonth: string;
  endMonth: string;
}

export interface IFlattenedInvestmentStatement extends IInvestmentStatement {
  investmentId: string;
  brokerageName: string;
  investmentType: string;
  investmentSubtype: string;
}

export interface IInvestmentChartData {
  month: string;
  // TODO: find out why this has to be type string as well
  [brokerageName: string]: number | string;
}

export interface ISelectedInvestment {
  investmentId: string;
  brokerageName: string;
  investmentType: string;
  investmentSubtype: string;
}

export interface IParsedStatementData {
  brokerageName: string;
  investmentType: string;
  investmentSubtype: string;
  startBalanceDate: Date;
  startBalance: number;
  endBalanceDate: Date;
  endBalance: number;
  depositAmount: number;
  withdrawalAmount: number;
}
