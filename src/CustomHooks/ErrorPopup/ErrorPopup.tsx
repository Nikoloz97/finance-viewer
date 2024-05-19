import React from "react";
import { Message } from "semantic-ui-react";
import "./ErrorPopup.css";

type ErrorType = {
  isErrorShowing: boolean;
  isErrorFadingIn: boolean;
  isErrorFadingOut: boolean;
  message: string;
};

type ErrorPopupProps = {
  error: ErrorType;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
};

const ErrorPopup: React.FC<ErrorPopupProps> = ({ error, setError }) => {
  const handleErrorFadeOut = () => {
    // Start the animation
    setError((prev) => ({ ...prev, isErrorFadingOut: true }));

    // Wait for animation to finish before disappearing
    setTimeout(() => {
      setError((prev) => ({
        ...prev,
        isErrorShowing: false,
        isErrorFadingOut: false,
      }));
    }, 450);
  };

  return (
    <>
      {error.isErrorShowing && (
        <Message
          className={`Error-Popup-Display ${error.isErrorFadingIn ? "Error-Popup-Fade-In-Up" : null} ${error.isErrorFadingOut ? "Error-Popup-Fade-Out-Down" : null}`}
          size="tiny"
          onDismiss={handleErrorFadeOut}
        >
          <Message.Header>{error.message}</Message.Header>
        </Message>
      )}
    </>
  );
};

export default ErrorPopup;
