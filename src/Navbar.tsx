import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="Navbar-Container">
      <div className="Navbar">
        <h2 style={{ marginTop: "10px" }}>Finance Viewer</h2>
        <div className="Navbar-Options">
          <Link to={"/"}>Dashboard</Link>
          <Link to={"/budget"}>Budget</Link>
          <Link to={"/budget"}>Allocation</Link>
          <Link to={"/budget"}>Debt</Link>
          <Link to={"/budget"}>Investments</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
