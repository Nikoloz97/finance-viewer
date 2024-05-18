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
  onDismiss: () => void;
};

const ErrorPopup: React.FC<ErrorPopupProps> = ({ error, onDismiss }) => {
  return (
    <>
      {error.isErrorShowing && (
        <Message
          className={`Error-Popup-Display ${error.isErrorFadingIn ? "Error-Popup-Fade-In-Up" : null} ${error.isErrorFadingOut ? "Error-Popup-Fade-Out-Down" : null}`}
          size="tiny"
          onDismiss={onDismiss}
        >
          {error.message !== "" && (
            <Message.Header>{error.message}</Message.Header>
          )}
        </Message>
      )}
    </>
  );
};

export default ErrorPopup;
