import { useState } from "react";
import { Button, Checkbox, Form, Header } from "semantic-ui-react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";
import ErrorPopup from "../CustomHooks/ErrorPopup/ErrorPopup";

const Login = () => {
  const { setUser } = UseContextCheck();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    isErrorFadingIn: false,
    isErrorFadingOut: false,
    isErrorShowing: false,
    message: "",
  });

  const handleErrorFadeOut = () => {
    setError((prev) => ({ ...prev, isErrorFadingOut: true }));

    setTimeout(() => {
      setError((prev) => ({
        ...prev,
        isErrorShowing: false,
        isErrorFadingOut: false,
      }));
    }, 500);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
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
      <Header textAlign="center">Welcome</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Username: </label>
          <input onChange={(e) => setUsername(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Password: </label>
          <input onChange={(e) => setPassword(e.target.value)} />
        </Form.Field>
        <Form.Field className="Remember-Forgot-Container">
          <Checkbox label="Remember me" />
          <Link to={"/forgot-password"}>Forgot Password?</Link>
        </Form.Field>
        <Form.Field className="Login-Button-Container">
          <Button type="submit" content="Login" />
        </Form.Field>
      </Form>

      <ErrorPopup error={error} onDismiss={handleErrorFadeOut} />
    </div>
  );
};

export default Login;
