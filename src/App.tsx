import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Budget from "./Budget";
import Allocation from "./Allocation";
import Debt from "./Debt";
import Investments from "./Investments";
import Profile from "./Profile";
import Settings from "./Settings";

import NotFound from "./NotFound";
import Navbar from "./Navbar/Navbar";

import "./App.css";

function App() {
  return (
    <div className="Navbar-Page-Container">
      <Router>
        <Navbar />
        <div className="Page-Style">
          <Routes>
            <Route path="/" Component={Dashboard} />
            <Route path="/budget" Component={Budget} />
            <Route path="/allocation" Component={Allocation} />
            <Route path="/debt" Component={Debt} />
            <Route path="/investments" Component={Investments} />
            <Route path="/profile" Component={Profile} />
            <Route path="/settings" Component={Settings} />

            <Route Component={NotFound} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
