import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Dashboard/Dashboard";
import About from "./About";
import NotFound from "./NotFound";
import Navbar from "./Navbar";

import "./App.css";

function App() {
  return (
    <div className="Navbar-Page-Container">
      <Router>
        <Navbar />
        <div className="Page-Style">
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/about" Component={About} />
            <Route Component={NotFound} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
