import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ShadcnComponents/Dialog";
import { Button } from "../ShadcnComponents/Button";
import "./Investments.css";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ShadcnComponents/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ShadcnComponents/Select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ShadcnComponents/Popover";
import { cn } from "../utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ShadcnComponents/Calendar";
import { Input } from "../ShadcnComponents/Input";
import { IFlattenedInvestmentStatement } from "../Models/Investments";

interface EditStatementDialogProps {
  setIsEditStatementDialogOpen: (isOpen: boolean) => void;
  isEditStatementDialogOpen: boolean;
  selectedStatement: IFlattenedInvestmentStatement;
  setSelectedStatement: (
    statement: IFlattenedInvestmentStatement | null
  ) => void;
  handleEditStatementSubmission: (
    updatedStatementData: IFlattenedInvestmentStatement
  ) => void;
}

const EditStatementDialog = ({
  isEditStatementDialogOpen,
  setIsEditStatementDialogOpen,
  selectedStatement,
  setSelectedStatement,
  handleEditStatementSubmission,
}: EditStatementDialogProps) => {
  const brokerages = ["Webull", "Vanguard", "Fidelity"];

  const investmentTypes = [
    "Stocks",
    "Savings",
    "Crypto",
    "Bonds",
    "Retirement",
  ];

  const handleCancelEditStatement = () => {
    setIsEditStatementDialogOpen(false);
    setSelectedStatement(null);
  };

  const investmentSubtypes = ["Individual", "ETF"];

  const editFormSchema = z
    .object({
      // TODO: Prevent from being edited
      // Or remove from being displayed entirely?
      investmentId: z.string().min(1, {
        message: "Please enter a valid Id",
      }),
      statementId: z.string().min(1, {
        message: "Please enter a valid Id",
      }),

      // TODO: Prevented from being edited?
      brokerageName: z.string().min(1, {
        message: "Please select a brokerage",
      }),
      investmentType: z.string().min(1, {
        message: "Please select an investment type",
      }),
      investmentSubtype: z.string().min(1, {
        message: "Please select an investment subtype",
      }),
      startBalance: z.preprocess(
        (input) => {
          if (typeof input === "number") {
            return input.toString();
          }
          return input;
        },
        z
          .string()
          .transform((value) => parseFloat(value))
          .refine((value) => !isNaN(value), {
            message: "Please enter a valid number",
          })
      ),
      startBalanceDate: z
        .preprocess(
          (input) => (typeof input === "string" ? new Date(input) : input),
          z.date({
            message: "Please select a valid date",
          })
        )
        .refine(
          (date) => {
            const day = date.getDate();
            return day >= 25 || day <= 5;
          },
          {
            message:
              "Day must be equal or less than the 5th or equal or greater than the 25th",
          }
        ),
      endBalance: z.preprocess(
        (input) => (typeof input === "number" ? input.toString() : input),
        z
          .string()
          .transform((value) => parseFloat(value))
          .refine((value) => !isNaN(value), {
            message: "Please enter a valid number",
          })
      ),
      endBalanceDate: z
        .preprocess(
          (input) => (typeof input === "string" ? new Date(input) : input),
          z.date({
            message: "Please select a valid date",
          })
        )
        .refine(
          (date) => {
            const day = date.getDate();
            return day >= 25 || day <= 5;
          },
          {
            message:
              "Day must be equal or less than the 5th or equal or greater than the 25th",
          }
        ),
      depositAmount: z.preprocess(
        (input) => (typeof input === "number" ? input.toString() : input),
        z
          .string()
          .transform((value) => parseFloat(value))
          .refine((value) => !isNaN(value), {
            message: "Please enter a valid number",
          })
      ),
      withdrawalAmount: z.preprocess(
        (input) => (typeof input === "number" ? input.toString() : input),
        z
          .string()
          .transform((value) => parseFloat(value))
          .refine((value) => !isNaN(value), {
            message: "Please enter a valid number",
          })
      ),
    })
    .refine((data) => data.endBalanceDate > data.startBalanceDate, {
      message: "End date must be after the start date",
      path: ["endBalanceDate"],
    });

  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      investmentId: selectedStatement.investmentId,
      brokerageName: selectedStatement.brokerageName,
      investmentType: selectedStatement.investmentType,
      investmentSubtype: selectedStatement.investmentSubtype,
      statementId: selectedStatement.statementId,
      startBalance: selectedStatement.startBalance,
      startBalanceDate: selectedStatement.startBalanceDate,
      endBalance: selectedStatement.endBalance,
      endBalanceDate: selectedStatement.endBalanceDate,
      depositAmount: selectedStatement.depositAmount,
      withdrawalAmount: selectedStatement.withdrawalAmount,
    },
  });

  return (
    <Dialog
      open={isEditStatementDialogOpen}
      onOpenChange={handleCancelEditStatement}
    >
      <DialogContent className="dark">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Statement</DialogTitle>
          <DialogDescription className="text-white">
            Edit Statement below:
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-6 mb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditStatementSubmission)}>
              <div className="Signup-Grid-Container text-white">
                <FormField
                  control={form.control}
                  name="brokerageName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <FormLabel>Brokerage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Brokerage" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {brokerages.map((brokerage, index) => (
                            <SelectItem key={index} value={brokerage}>
                              {brokerage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <FormLabel>Investment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {investmentTypes.map((investmentType, index) => (
                            <SelectItem key={index} value={investmentType}>
                              {investmentType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentSubtype"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <FormLabel>Investment Subtype</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Subtype" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {investmentSubtypes.map(
                            (investmentSubtype, index) => (
                              <SelectItem key={index} value={investmentSubtype}>
                                {investmentSubtype}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startBalanceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Statement Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date Balance</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endBalanceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Statement End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date Balance</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depositAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Amount</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="withdrawalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Withdrawal Amount</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="Login-Button-Container">
                <Button className="dark" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatementDialog;
