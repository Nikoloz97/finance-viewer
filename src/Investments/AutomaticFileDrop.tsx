import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ShadcnComponents/Form";
import { Input } from "../ShadcnComponents/Input";
import { IParsedInvestmentData } from "../Models/Investments";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ShadcnComponents/Button";

interface AutomaticFileDropProps {
  setParsedInvestmentData: React.Dispatch<
    React.SetStateAction<IParsedInvestmentData | undefined>
  >;
}

const AutomaticFileDrop = ({
  setParsedInvestmentData,
}: AutomaticFileDropProps) => {
  const formSchema = z.object({
    statementFilePath: z.custom(
      (filePath) => {
        const allowedExtensions = [".pdf"];
        return allowedExtensions.some((extension) =>
          filePath.toLowerCase().endsWith(extension)
        );
      },
      {
        message: "Invalid file type. Allowed extensions are: pdf",
      }
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      statementFilePath: "",
    },
  });

  const handleStatementParsing = () => {
    // TODO: Implement parsing here

    const dummyParsedStatementData = {
      brokerageName: "Webull",
      type: "Stocks",
      subtype: "Individual",
      startBalanceDate: new Date(11 - 1 - 2024),
      startBalance: 6000,
      endBalanceDate: new Date(11 - 1 - 2024),
      endBalance: 7000,
      withdrawalAmount: 100,
      depositAmount: 500,
    };
    setParsedInvestmentData(dummyParsedStatementData);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleStatementParsing)}>
          <FormField
            control={form.control}
            name="statementFilePath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop Statement Here:</FormLabel>
                <FormControl>
                  <Input {...field} type="file" className="text-black" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="dark" type="submit">
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AutomaticFileDrop;
