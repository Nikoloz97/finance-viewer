import { Switch } from "../../ShadcnComponents/Switch";
import { Label } from "../../ShadcnComponents/Label";
import React from "react";

const Preferences = () => {
  return (
    <div>
      <p>Make changes to your preferences here</p>
      <div className="flex items-center space-x-2">
        <Switch id="light-mode" />
        <Label htmlFor="light-mode">Light Mode</Label>
      </div>
    </div>
  );
};

export default Preferences;
