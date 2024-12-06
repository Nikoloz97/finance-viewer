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
import { IParsedStatementData } from "../Models/Investments";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ShadcnComponents/Button";

interface AutomaticFileDropProps {
  setParsedStatementData: React.Dispatch<
    React.SetStateAction<IParsedStatementData | undefined>
  >;
}

const AutomaticFileDrop = ({
  setParsedStatementData,
}: AutomaticFileDropProps) => {
  const formSchema = z.object({
    statementFilePath: z.custom(
      (filePath) => {
        const allowedExtensions = [".jpeg", ".jpg", ".png"];
        return allowedExtensions.some(
          (extension) =>
            filePath.toLowerCase().endsWith(extension) || filePath === ""
        );
      },
      {
        message: "Invalid file type",
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
    console.log("Statement Parsed!");
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
        </form>
        <Button className="dark" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AutomaticFileDrop;
