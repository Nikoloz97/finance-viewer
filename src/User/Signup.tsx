import React, { useState } from "react";
import "./User.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [signupInfo, setSignupInfo] = useState({
    username: null,
    password: null,
    email: null,
    firstname: null,
    lastname: null,
    occupation: null,
    profileImgUrl: null,
  });

  const [error, setError] = useState({
    isErrorFadingIn: false,
    isErrorFadingOut: false,
    isErrorShowing: false,
    message: "",
  });

  const handleSignup = async () => {
    const response = await fetch("/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signupInfo }),
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

  return <div>Welcome New User</div>;
};

export default Signup;
