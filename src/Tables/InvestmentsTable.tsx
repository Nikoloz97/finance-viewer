"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ShadcnComponents/Table";
import { IFlattenedInvestmentStatement } from "../Models/Investments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ShadcnComponents/Dropdown";
import { Button } from "../ShadcnComponents/Button";
import { MoreHorizontal } from "lucide-react";

interface DataTableProps {
  data: IFlattenedInvestmentStatement[];
  handleStatementEdit: (statement: IFlattenedInvestmentStatement) => void;
}

export function InvestmentsTable({
  data,
  handleStatementEdit,
}: DataTableProps) {
  const InvestmentsColumns: ColumnDef<IFlattenedInvestmentStatement>[] = [
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
              <DropdownMenuItem onClick={() => handleStatementEdit(statement)}>
                Edit statement
              </DropdownMenuItem>
              <DropdownMenuItem
              // onClick={() => handleStatementDelete(statement.statementId)}
              >
                Delete Statement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns: InvestmentsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={InvestmentsColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
