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
import { Input } from "../ShadcnComponents/Input";
import {
  INewInvestmentReport,
  IParsedInvestmentData,
} from "../Models/Investments";
import { investmentBrokerages } from "../Utils/Brokerages";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface InvestmentAddFormProps {
  parsedData?: IParsedInvestmentData;
  handleAdd: (newInvestmentReport: INewInvestmentReport) => void;
}

const InvestmentAddForm = ({
  parsedData,
  handleAdd,
}: InvestmentAddFormProps) => {
  // TODO: work on adding this check back in
  // Min + max possible value for type int32
  const MIN_INT32 = -(2 ** 31);
  const MAX_INT32 = 2 ** 31;

  const investmentTypes = [
    "Stocks",
    "Savings",
    "Crypto",
    "Bonds",
    "Retirement",
  ];

  const investmentSubtypes = ["Individual", "ETF"];

  const addFormSchema = z
    .object({
      brokerageName: z.string().min(1, {
        message: "Please select a brokerage",
      }),
      investmentType: z.string().min(1, {
        message: "Please select an investment type",
      }),
      investmentSubtype: z.string().min(1, {
        message: "Please select an investment subtype",
      }),
      startBalanceDate: z
        .date({
          message: "Please select a start date",
        })
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
      startBalance: z.preprocess(
        (input) => (typeof input === "number" ? input.toString() : input),
        z
          .string()
          .transform((value) => parseFloat(value))
          .refine((value) => !isNaN(value), {
            message: "Please enter a valid number",
          })
      ),
      endBalanceDate: z
        .date({
          message: "Please select an end date",
        })
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

  const form = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: parsedData
      ? {
          brokerageName: parsedData.brokerageName,
          investmentType: parsedData.investmentType,
          investmentSubtype: parsedData.investmentSubtype,
          startBalanceDate: parsedData.startBalanceDate,
          startBalance: parsedData.startBalance,
          endBalanceDate: parsedData.endBalanceDate,
          endBalance: parsedData.endBalance,
          depositAmount: parsedData.depositAmount,
          withdrawalAmount: parsedData.withdrawalAmount,
        }
      : {
          brokerageName: "",
          investmentType: "",
          investmentSubtype: "",
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
      <Header textAlign="center">Investment Add Form</Header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)}>
          <div className="Signup-Grid-Container">
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
                      {investmentBrokerages.map((brokerage, index) => (
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
                      {investmentSubtypes.map((investmentSubtype, index) => (
                        <SelectItem key={index} value={investmentSubtype}>
                          {investmentSubtype}
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
              Add
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InvestmentAddForm;
