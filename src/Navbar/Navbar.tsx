import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { UseUseUseContext } from "../CustomHooks/UseUseUseContext";

const Navbar = () => {
  const { user } = UseUseUseContext();

  return (
    <div className="Navbar-Container">
      <div className="Navbar">
        <h2 style={{ marginTop: "10px" }}>Finance Viewer</h2>
        <div className="Navbar-Options">
          <Link to={"/"}>Dashboard</Link>
          <Link to={"/budget"}>Budget</Link>
          <Link to={"/allocation"}>Allocation</Link>
          <Link to={"/debt"}>Debt</Link>
          <Link to={"/investments"}>Investments</Link>
          {user ? (
            <Link to={"/profile"}>Profile</Link>
          ) : (
            <Link to={"/login"}>Login</Link>
          )}
          <Link to={"/settings"}>Settings</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
