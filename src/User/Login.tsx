import { useState } from "react";
import { Button, Checkbox, Form, Header } from "semantic-ui-react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const user = await response.json();
      // Handle login stuff here
      console.log(user);
    } else {
      console.log("Oops, something went wrong :(");
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
    </div>
  );
};

export default Login;
