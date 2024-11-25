import { useState } from "react";
import { Header } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";
import ErrorPopup from "../CustomHooks/ErrorPopup/ErrorPopup";
import "./User.css";
import { Button } from "../ShadcnComponents/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ShadcnComponents/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ShadcnComponents/Input";

const Login = () => {
  const { setUser } = UseContextCheck();
  const navigate = useNavigate();

  const [error, setError] = useState({
    isErrorFadingIn: false,
    isErrorFadingOut: false,
    isErrorShowing: false,
    message: "",
  });

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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const responseJson = await response.json();

    if (response.ok) {
      // Handle login
      setUser(responseJson);
      navigate("/");
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
    <div className="Login-Form">
      <Header textAlign="center">Welcome Back</Header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          {/* <FormField>
            <label>Password: </label>
            <input onChange={(e) => setPassword(e.target.value)} />
          </FormField> */}
          {/* <FormField className="Remember-Forgot-Container">
            <Checkbox label="Remember me" />
            <Link style={{ color: "white" }} to={"/user/forgot-password"}>
              Forgot Password?
            </Link>
          </FormField> */}

          <div className="Login-Button-Container">
            <Button className="dark" type="submit">
              Login
            </Button>
          </div>
        </form>
      </Form>

      <Link className="No-Account-Container" to={"/user/signup"}>
        Don't have an account? Sign up here
      </Link>

      <ErrorPopup error={error} setError={setError} />
    </div>
  );
};

export default Login;
