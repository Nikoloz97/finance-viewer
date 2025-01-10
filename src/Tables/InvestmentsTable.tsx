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
  handleStatementEdit: (
    flattenedInvestmentStatement: IFlattenedInvestmentStatement
  ) => void;
  handleStatementDelete: (investmentId: string, statementId: string) => void;
}

export function InvestmentsTable({
  data,
  handleStatementEdit,
  handleStatementDelete,
}: DataTableProps) {
  const InvestmentsColumns: ColumnDef<IFlattenedInvestmentStatement>[] = [
    {
      accessorKey: "brokerageName",
      header: "Brokerage Name",
    },
    {
      accessorKey: "type",
      header: "Investment Type",
    },
    {
      accessorKey: "subtype",
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
      accessorKey: "startDate",
      header: "Start Balance Date",
      cell: ({ row }) => {
        const startDate = new Date(row.getValue("startDate"));
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        }).format(startDate);

        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "endBalance",
      header: "End Balance",
      cell: ({ row }) => {
        const startBalance = parseFloat(row.getValue("endBalance"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(startBalance);

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "endDate",
      header: "End Balance Date",
      cell: ({ row }) => {
        const endDate = new Date(row.getValue("endDate"));
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        }).format(endDate);

        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "depositAmount",
      header: "Deposit Amount",
      cell: ({ row }) => {
        const depositAmount = parseFloat(row.getValue("depositAmount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(depositAmount);

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "withdrawalAmount",
      header: "Withdrawal Amount",
      cell: ({ row }) => {
        const withdrawalAmount = parseFloat(row.getValue("withdrawalAmount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(withdrawalAmount);

        return <div>{formatted}</div>;
      },
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
        const flattenedInvestmentStatement = row.original;

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
              <DropdownMenuItem
                onClick={() =>
                  handleStatementEdit(flattenedInvestmentStatement)
                }
              >
                Edit statement
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleStatementDelete(
                    flattenedInvestmentStatement.investmentId,
                    flattenedInvestmentStatement.statementId
                  )
                }
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
    <div className="rounded-md border text-center">
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
