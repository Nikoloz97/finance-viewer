import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
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
          <Link to={"/settings"}>Settings</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
