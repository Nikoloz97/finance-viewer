import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "../ShadcnComponents/Input";
import { INewInvestment, IParsedInvestmentData } from "../Models/Investments";
import { investmentBrokerages } from "../Utils/Brokerages";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ShadcnComponents/Command";

interface InvestmentAddFormProps {
  parsedData?: IParsedInvestmentData;
  handleAdd: (newInvestment: INewInvestment) => void;
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
      type: z.string().min(1, {
        message: "Please select an investment type",
      }),
      subtype: z.string().min(1, {
        message: "Please select an investment subtype",
      }),
      startDate: z
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
      endDate: z
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
    .refine((data) => data.endDate > data.startDate, {
      message: "End date must be after the start date",
      path: ["endDate"],
    });

  const form = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: parsedData
      ? {
          brokerageName: parsedData.brokerageName,
          type: parsedData.type,
          subtype: parsedData.subtype,
          startDate: parsedData.startDate,
          startBalance: parsedData.startBalance,
          endDate: parsedData.endDate,
          endBalance: parsedData.endBalance,
          depositAmount: parsedData.depositAmount,
          withdrawalAmount: parsedData.withdrawalAmount,
        }
      : {
          brokerageName: "",
          type: "",
          subtype: "",
          startDate: new Date(),
          startBalance: 0,
          endDate: new Date(),
          endBalance: 0,
          depositAmount: 0,
          withdrawalAmount: 0,
        },
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)}>
          <div className="Signup-Grid-Container">
            <FormField
              control={form.control}
              name="brokerageName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Brokerage</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? investmentBrokerages.find(
                                (brokerage) => brokerage === field.value
                              )
                            : "Select brokerage"}
                          <ChevronsUpDown />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search brokerage..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No brokerage found.</CommandEmpty>
                          <CommandGroup>
                            {investmentBrokerages.map((brokerage) => (
                              <CommandItem
                                value={brokerage}
                                key={brokerage}
                                onSelect={() => {
                                  form.setValue("brokerageName", brokerage);
                                }}
                              >
                                {brokerage}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    brokerage === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
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
              name="subtype"
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
