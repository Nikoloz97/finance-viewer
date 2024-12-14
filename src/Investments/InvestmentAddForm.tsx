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
import { Calendar } from "../ShadcnComponents/Calendar";
import { Input } from "../ShadcnComponents/Input";
import { IParsedStatementData } from "../Models/Investments";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";

interface InvestmentAddFormProps {
  parsedStatementData?: IParsedStatementData;
}

const InvestmentAddForm = ({ parsedStatementData }: InvestmentAddFormProps) => {
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
    brokerageName: z.string().min(1, {
      message: "Please select a brokerage",
    }),
    investmentType: z.string().min(1, {
      message: "Please select an investment type",
    }),
    investmentSubtype: z.string().min(1, {
      message: "Please select an investment subtype",
    }),
    startDate: z.date({
      message: "Please select a start date",
    }),
    startBalance: z
      .string()
      .transform((value) => parseFloat(value))
      .refine((value) => !isNaN(value), {
        message: "Please enter a valid number",
      }),
    endDate: z.date({
      message: "Please select an end date",
    }),
    endBalance: z
      .string()
      .transform((value) => parseFloat(value))
      .refine((value) => !isNaN(value), {
        message: "Please enter a valid number",
      }),
    depositAmount: z
      .string()
      .transform((value) => parseFloat(value))
      .refine((value) => !isNaN(value), {
        message: "Please enter a valid number",
      }),
    withdrawalAmount: z
      .string()
      .transform((value) => parseFloat(value))
      .refine((value) => !isNaN(value), {
        message: "Please enter a valid number",
      }),
  });

  const form = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: parsedStatementData
      ? {
          brokerageName: parsedStatementData.brokerageName,
          investmentType: parsedStatementData.investmentType,
          investmentSubtype: parsedStatementData.investmentSubtype,
          startDate: parsedStatementData.startDate,
          startBalance: parsedStatementData.startBalance,
          endDate: parsedStatementData.endDate,
          endBalance: parsedStatementData.endBalance,
          depositAmount: parsedStatementData.depositAmount,
          withdrawalAmount: parsedStatementData.withdrawalAmount,
        }
      : {
          brokerageName: "",
          investmentType: "",
          investmentSubtype: "",
          startDate: new Date(),
          startBalance: 0,
          endDate: new Date(),
          endBalance: 0,
          depositAmount: 0,
          withdrawalAmount: 0,
        },
  });

  const handleAddInvestmentSubmission = async (
    newInvestmentData: z.infer<typeof addFormSchema>
  ) => {
    if (!user) {
      console.error("No user defined");
      return;
    }
    const newInvestmentDataWithUserId = {
      ...newInvestmentData,
      userId: user._id,
    };

    const response = await fetch("/investments/addInvestment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInvestmentDataWithUserId),
    });

    const responseJson = await response.json();

    if (response.ok) {
      // TODO: eventually remove this line
      console.log(responseJson);
    } else {
      // Specific message
      if (responseJson.message) {
        // Non-specific message
      } else {
      }
    }
  };

  return (
    <div>
      <Header textAlign="center">Investment Add Form</Header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddInvestmentSubmission)}>
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
                      {investmentSubtypes.map((investmentSubtype) => (
                        <SelectItem value={investmentSubtype}>
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
              name="startDate"
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
              name="endDate"
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

export default InvestmentAddForm;
