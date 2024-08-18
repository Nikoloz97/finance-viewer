import React, { useState } from "react";
import { Button, Form, Header, Icon } from "semantic-ui-react";
import "./User.css";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../CustomHooks/ErrorPopup/ErrorPopup";

const Signup = () => {
  const navigate = useNavigate();

  const [signupInfo, setSignupInfo] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    occupation: "",
    profileImageFile: "",
  });

  const [error, setError] = useState({
    isErrorFadingIn: false,
    isErrorFadingOut: false,
    isErrorShowing: false,
    message: "",
  });

  const [profilePhotoDisplayText, setProfilePhotoDisplayText] = useState(
    "Click here to choose a file"
  );

  const [isProfilePhotoClearingDisabled, setIsProfilePhotoClearingDisabled] =
    useState(true);

  const handleFileInput = (e: any) => {
    setSignupInfo({
      ...signupInfo,
      profileImageFile: e.target.files[0],
    });

    if (e.target.files.length !== 0) {
      setProfilePhotoDisplayText(`File Chosen: ${e.target.files[0].name}`);
      setIsProfilePhotoClearingDisabled(false);
    }
  };

  const handleProfilePhotoClearing = () => {
    setSignupInfo({
      ...signupInfo,
      profileImageFile: "",
    });

    setProfilePhotoDisplayText("Click here to choose a file");

    setIsProfilePhotoClearingDisabled(true);
  };

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

  return (
    <div>
      <Header textAlign="center">Welcome, New User</Header>
      <Form onSubmit={handleSignup}>
        <Form.Field className="Signup-Form-Group">
          <div style={{ width: "50%" }}>
            <label>Username: </label>
            <input
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, username: e.target.value })
              }
            />
          </div>
          <div style={{ width: "50%" }}>
            <label>Password: </label>
            <input
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, password: e.target.value })
              }
            />
          </div>
        </Form.Field>
        <Form.Field>
          <label>Email: </label>
          <input
            onChange={(e) =>
              setSignupInfo({ ...signupInfo, email: e.target.value })
            }
          />
        </Form.Field>
        <Form.Field className="Signup-Form-Group">
          <div style={{ width: "50%" }}>
            <label>Firstname: </label>
            <input
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, firstName: e.target.value })
              }
            />
          </div>
          <div style={{ width: "50%" }}>
            <label>Lastname: </label>
            <input
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, lastName: e.target.value })
              }
            />
          </div>
        </Form.Field>
        <Form.Field className="Signup-Form-Group">
          <div style={{ width: "50%" }}>
            <label>Occupation: </label>
            <input
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, occupation: e.target.value })
              }
            />
          </div>
          <div style={{ width: "50%" }}>
            <label>Profile Image: </label>
            <div style={{ display: "flex" }}>
              <Button
                as="label"
                htmlFor="fileInput"
                className="Signup-File-Input-Button"
              >
                {profilePhotoDisplayText}
              </Button>
              <input
                id="fileInput"
                type="file"
                onChange={(e) => handleFileInput(e)}
                style={{ display: "none" }}
              />
              <Button
                className="Profile-Photo-Cancel-Button"
                onClick={handleProfilePhotoClearing}
                disabled={isProfilePhotoClearingDisabled}
                icon
              >
                <Icon name="cancel"></Icon>
              </Button>
            </div>
          </div>
        </Form.Field>
        <Form.Field className="Login-Button-Container">
          <Button type="submit" content="Sign up" />
        </Form.Field>
      </Form>

      <ErrorPopup error={error} setError={setError} />
    </div>
  );
};

export default Signup;
