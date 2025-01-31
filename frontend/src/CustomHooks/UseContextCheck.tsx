import { useContext } from "react";
import { UserContext } from "../UserContext";

export function UseContextCheck() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext is undefined!");
  }
  return context;
}
