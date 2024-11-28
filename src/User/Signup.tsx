import { useState } from "react";
import { Header } from "semantic-ui-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ShadcnComponents/Form";
import "./User.css";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../CustomHooks/ErrorPopup/ErrorPopup";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ShadcnComponents/Button";
import { Input } from "../ShadcnComponents/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ShadcnComponents/Popover";
import { cn } from "../utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ShadcnComponents/Command";

const Signup = () => {
  const navigate = useNavigate();

  const [error, setError] = useState({
    isErrorFadingIn: false,
    isErrorFadingOut: false,
    isErrorShowing: false,
    message: "",
  });

  const occupations = [
    { label: "Software/IT", value: "si" },
    { label: "Finance", value: "fn" },
    { label: "Business", value: "bs" },
    { label: "Medicine", value: "md" },
    { label: "Education", value: "ed" },
    { label: "Hospitality", value: "hs" },
    { label: "Government", value: "gv" },
    { label: "Aviation", value: "av" },
    { label: "Other", value: "ot" },
  ] as const;

  const formSchema = z.object({
    username: z
      .string()
      .min(5, {
        message: "Username must be at least 5 characters",
      })
      .max(50),
    password: z
      .string()
      .min(5, {
        message: "Password must be at least 5 characters",
      })
      .max(50),
    email: z
      .string()
      .email()
      .min(10, {
        message: "Please enter a valid email",
      })
      .max(50),
    firstName: z
      .string()
      .min(5, {
        message: "First name must be at least 5 characters",
      })
      .max(50),
    lastName: z
      .string()
      .min(5, {
        message: "Last name must be at least 5 characters",
      })
      .max(50),
    occupation: z.string({
      required_error: "Please select an occupation.",
    }),
    profileImageFile: z.custom(
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
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      occupation: "",
      profileImageFile: "",
    },
  });

  const handleSignup = async (signUpInfo: z.infer<typeof formSchema>) => {
    const response = await fetch("/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpInfo),
    });

    const responseJson = await response.json();

    if (response.ok) {
      // Handle signup
      navigate("/user/login");
      // TODO: eventually remove this line
      console.log(responseJson);
    } else {
      // Specific message
      if (responseJson.message) {
        setError((prev) => ({
          ...prev,
          isErrorShowing: true,
          isErrorFadingIn: true,
          message: responseJson.message,
        }));
        // Non-specific message
      } else {
        setError((prev) => ({
          ...prev,
          isErrorShowing: true,
          message: "See console log for details",
        }));
        console.log(responseJson);
      }
    }
  };

  return (
    <div>
      <Header textAlign="center">Welcome, New User</Header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)}>
          <div className="Signup-Grid-Container">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username:</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name:</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name:</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <FormLabel>Occupation:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between h-10 text-black",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? occupations.find(
                                (occupation) => occupation.value === field.value
                              )?.label
                            : "Select category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {occupations.map((occupation) => (
                              <CommandItem
                                value={occupation.label}
                                key={occupation.value}
                                className="text-black"
                                onSelect={() => {
                                  form.setValue("occupation", occupation.value);
                                }}
                              >
                                {occupation.label}
                                <Check
                                  className={cn(
                                    "ml-auto text-black",
                                    occupation.value === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="profileImageFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image:</FormLabel>
                <FormControl>
                  <Input {...field} type="file" className="text-black" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="Login-Button-Container">
            <Button className="dark" type="submit">
              Sign Up
            </Button>
          </div>
        </form>
      </Form>

      <ErrorPopup error={error} setError={setError} />
    </div>
  );
};

export default Signup;
