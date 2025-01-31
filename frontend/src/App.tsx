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
import { Slide, ToastContainer } from "react-toastify";
import { Check, CircleAlert, Info, TriangleAlert } from "lucide-react";

function App() {
  return (
    <div className="Navbar-Page-Container">
      <UserProvider>
        <Router>
          <div className="Navbar-Container-Container">
            <Navbar />
          </div>
          <div className="Page-Container">
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
        <ToastContainer
          theme="dark"
          autoClose={3000}
          closeOnClick
          hideProgressBar
          position="bottom-right"
          transition={Slide}
          icon={({ type }) => {
            switch (type) {
              case "info":
                return <Info className="stroke-indigo-400" />;
              case "error":
                return <CircleAlert className="stroke-red-500" />;
              case "success":
                return <Check className="stroke-green-500" />;
              case "warning":
                return <TriangleAlert className="stroke-yellow-500" />;
              default:
                return null;
            }
          }}
        />
      </UserProvider>
    </div>
  );
}

export default App;
