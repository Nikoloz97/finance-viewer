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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ShadcnComponents/Popover";
import { cn } from "../utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "../ShadcnComponents/Input";
import { INewStatement, IParsedInvestmentData } from "../Models/Investments";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface StatementAddFormProps {
  parsedData?: IParsedInvestmentData;
  handleAdd: (newStatement: INewStatement) => void;
}

const StatementAddForm = ({ parsedData, handleAdd }: StatementAddFormProps) => {
  // TODO: work on adding this check back in
  // Min + max possible value for type int32
  const MIN_INT32 = -(2 ** 31);
  const MAX_INT32 = 2 ** 31;

  const addFormSchema = z
    .object({
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
      // TODO: try out coercion here? Or nan?
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
          startDate: parsedData.startDate,
          startBalance: parsedData.startBalance,
          endDate: parsedData.endDate,
          endBalance: parsedData.endBalance,
          depositAmount: parsedData.depositAmount,
          withdrawalAmount: parsedData.withdrawalAmount,
        }
      : {
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
                  <FormLabel>Start Balance</FormLabel>
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
                  <FormLabel>End Balance</FormLabel>
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
