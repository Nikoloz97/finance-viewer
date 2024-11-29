import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Dashboard from "./Dashboard/Dashboard";
import Budget from "./Budget";
import Allocation from "./Allocation";
import Debt from "./Debt";
import Investments from "./Investments/Investments";
import Profile from "./Profile";
import Settings from "./Settings";
import NotFound from "./NotFound";
import Navbar from "./Navbar/Navbar";
import Login from "./User/Login";
import Signup from "./User/Signup";

import "./Styles/Globals.css";
import "./App.css";

function App() {
  return (
    <div className="Navbar-Page-Container">
      <UserProvider>
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
              <Route path="/user/login" Component={Login} />
              <Route path="/user/signup" Component={Signup} />
              <Route Component={NotFound} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
