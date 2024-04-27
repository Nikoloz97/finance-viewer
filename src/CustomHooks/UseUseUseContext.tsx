import React, { useContext } from "react";
import { UserContext } from "../UserContext";

export function UseUseUseContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext is undefined!");
  }
  return context;
}
