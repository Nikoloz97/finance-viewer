export interface IInvestment {
  _id: string;
  userId: string;
  brokerageName: string;
  type: string;
  subtype: string;
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
}

export interface INewStatement {
  startBalance: number;
  startBalanceDate: Date;
  endBalance: number;
  endBalanceDate: Date;
  depositAmount: number;
  withdrawalAmount: number;
}

export interface IFlattenedInvestmentStatement extends IInvestmentStatement {
  investmentId: string;
  brokerageName: string;
  type: string;
  subtype: string;
}

export interface INewInvestment {
  brokerageName: string;
  type: string;
  subtype: string;
  startBalance: number;
  startBalanceDate: Date;
  endBalance: number;
  endBalanceDate: Date;
  depositAmount: number;
  withdrawalAmount: number;
}

export interface IInvestmentChartData {
  month: string;
  // TODO: find out why this has to be type string as well
  [brokerageName: string]: number | string;
}

export interface ISelectedInvestment {
  investmentId: string;
  brokerageName: string;
  type: string;
  subtype: string;
}

export interface IParsedInvestmentData {
  brokerageName: string;
  type: string;
  subtype: string;
  startBalanceDate: Date;
  startBalance: number;
  endBalanceDate: Date;
  endBalance: number;
  depositAmount: number;
  withdrawalAmount: number;
}
