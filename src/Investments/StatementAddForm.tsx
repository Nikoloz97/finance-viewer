import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Header } from "semantic-ui-react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ShadcnComponents/Form";
import { Button } from "../ShadcnComponents/Button";
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
import { INewStatement, IParsedInvestmentData } from "../Models/Investments";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";

interface StatementAddFormProps {
  parsedData?: IParsedInvestmentData;
  handleAdd: (newStatement: INewStatement) => void;
}

const StatementAddForm = ({ parsedData, handleAdd }: StatementAddFormProps) => {
  // TODO: work on adding this check back in
  // Min + max possible value for type int32
  const MIN_INT32 = -(2 ** 31);
  const MAX_INT32 = 2 ** 31;

  const { user } = UseContextCheck();

  const brokerages = ["Webull", "Vanguard", "Fidelity"];

  const investmentTypes = [
    "Stocks",
    "Savings",
    "Crypto",
    "Bonds",
    "Retirement",
  ];

  const investmentSubtypes = ["Individual", "ETF"];

  const addFormSchema = z.object({
    startBalanceDate: z.date({
      message: "Please select a start date",
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
    endBalanceDate: z.date({
      message: "Please select an end date",
    }),
    endBalance: z.preprocess(
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
    depositAmount: z.preprocess(
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
    withdrawalAmount: z.preprocess(
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
  });

  const form = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: parsedData
      ? {
          startBalanceDate: parsedData.startBalanceDate,
          startBalance: parsedData.startBalance,
          endBalanceDate: parsedData.endBalanceDate,
          endBalance: parsedData.endBalance,
          depositAmount: parsedData.depositAmount,
          withdrawalAmount: parsedData.withdrawalAmount,
        }
      : {
          startBalanceDate: new Date(),
          startBalance: 0,
          endBalanceDate: new Date(),
          endBalance: 0,
          depositAmount: 0,
          withdrawalAmount: 0,
        },
  });

  return (
    <div>
      <Header textAlign="center">Statement Add Form</Header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)}>
          <div className="Signup-Grid-Container">
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
              Add
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StatementAddForm;