import {
  Dialog,
  DialogContent,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ShadcnComponents/Popover";
import { cn } from "../utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "../ShadcnComponents/Input";
import { IFlattenedInvestmentStatement } from "../Models/Investments";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

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
  const handleCancelEditStatement = () => {
    setIsEditStatementDialogOpen(false);
    setSelectedStatement(null);
  };

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
      type: z.string().min(1, {
        message: "Please select an investment type",
      }),
      subtype: z.string().min(1, {
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
      type: selectedStatement.type,
      subtype: selectedStatement.subtype,
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
        </DialogHeader>
        <div className="flex justify-center space-x-6 mb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditStatementSubmission)}>
              <div className="Signup-Grid-Container text-white">
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
                          <DayPicker
                            className="p-3"
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
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
                          <DayPicker
                            className="p-3"
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
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
