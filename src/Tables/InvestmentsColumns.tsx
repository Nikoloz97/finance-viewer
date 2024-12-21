import { ColumnDef } from "@tanstack/react-table";
import { IFlattenedInvestmentStatement } from "../Models/Investments";

export const InvestmentsColumns: ColumnDef<IFlattenedInvestmentStatement>[] = [
  {
    accessorKey: "brokerageName",
    header: "Brokerage Name",
  },
  {
    accessorKey: "investmentType",
    header: "Investment Type",
  },
  {
    accessorKey: "investmentSubtype",
    header: "Investment Subtype",
  },
  {
    accessorKey: "startBalance",
    header: "Start Balance",
  },
  {
    accessorKey: "startBalanceDate",
    header: "Start Balance Date",
  },
  {
    accessorKey: "endBalance",
    header: "End Balance",
  },
  {
    accessorKey: "endBalanceDate",
    header: "End Balance Date",
  },
  {
    accessorKey: "depositAmount",
    header: "Deposit Amount",
  },
  {
    accessorKey: "withdrawalAmount",
    header: "Withdrawal Amount",
  },
  {
    accessorKey: "startMonth",
    header: "Start Month",
  },
  {
    accessorKey: "endMonth",
    header: "End Month",
  },
];
