import { ColumnDef } from "@tanstack/react-table";
import { IFlattenedInvestmentStatement } from "../Models/Investments";
import { Button } from "../ShadcnComponents/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ShadcnComponents/Dropdown";
import { MoreHorizontal } from "lucide-react";

const handleStatementEdit = () => {};

// const handleStatementDelete = async (statementId: string) => {
//   // eslint-disable-next-line no-restricted-globals
//   if (confirm("Are you sure you want to delete this statement?")) {
//     try {
//       const response =
//         await delete `/investments/investmentReports?userId=${user?._id}`;
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const jsonData: IInvestmentReport[] = await response.json();
//       setInvestmentReports(jsonData);
//     } catch (err) {
//       console.error(err);
//     }
//   }
// };

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
  {
    accessorKey: "statementId",
    header: "Statement ID",
  },
  {
    accessorKey: "investmentId",
    header: "Investment ID",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const statement = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleStatementEdit}>
              Edit statement
            </DropdownMenuItem>
            <DropdownMenuItem
            // onClick={() => handleStatementDelete(statement.id)}
            >
              Delete Statement
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
