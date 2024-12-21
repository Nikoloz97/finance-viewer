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
    cell: ({ row }) => {
      const startBalance = parseFloat(row.getValue("startBalance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(startBalance);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "startBalanceDate",
    header: "Start Balance Date",
    cell: ({ row }) => {
      const startBalanceDate = new Date(row.getValue("startBalanceDate"));
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(startBalanceDate);

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "endBalance",
    header: "End Balance",
    cell: ({ row }) => {
      const startBalance = parseFloat(row.getValue("startBalance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(startBalance);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "endBalanceDate",
    header: "End Balance Date",
    cell: ({ row }) => {
      const endBalanceDate = new Date(row.getValue("endBalanceDate"));
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(endBalanceDate);

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "depositAmount",
    header: "Deposit Amount",
    cell: ({ row }) => {
      const startBalance = parseFloat(row.getValue("startBalance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(startBalance);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "withdrawalAmount",
    header: "Withdrawal Amount",
    cell: ({ row }) => {
      const startBalance = parseFloat(row.getValue("startBalance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(startBalance);

      return <div>{formatted}</div>;
    },
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
