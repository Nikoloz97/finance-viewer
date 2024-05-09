import { Button, Checkbox, Form, Header } from "semantic-ui-react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="Login-Form">
      <Header textAlign="center">Welcome </Header>
      <Form>
        <Form.Field>
          <label>Username: </label>
          <input />
        </Form.Field>
        <Form.Field>
          <label>Password: </label>
          <input />
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
