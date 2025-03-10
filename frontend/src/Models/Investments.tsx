export interface IInvestment {
  _id: string;
  userId: string;
  brokerageName: string;
  type: string;
  subtype: string;
  color: string;
  statements: IInvestmentStatement[];
}

// TODO: rename to just Statement?
export interface IInvestmentStatement {
  statementId: string;
  startBalance: number;
  startDate: Date;
  endBalance: number;
  endDate: Date;
  depositAmount: number;
  withdrawalAmount: number;
}

export interface INewStatement {
  startBalance: number;
  startDate: Date;
  endBalance: number;
  endDate: Date;
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
  startDate: Date;
  endBalance: number;
  endDate: Date;
  depositAmount: number;
  withdrawalAmount: number;
}

export interface IInvestmentChartData {
  month: string;
  // TODO: find out why the value (corresponds to balance) has to be type string as well
  [brokerageName: string]: number | string;
}

export interface IInvestmentChartConfig {
  [brokerageName: string]: {
    label: string;
    color: string;
  };
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
  startDate: Date;
  startBalance: number;
  endDate: Date;
  endBalance: number;
  depositAmount: number;
  withdrawalAmount: number;
}
