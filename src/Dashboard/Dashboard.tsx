import "./Dashboard.css";
import { UseContextCheck } from "../CustomHooks/UseContextCheck";
import Profile from "./Profile";
import RecentActivity from "./RecentActivity";
import Networth from "./Networth";

const Dashboard = () => {
  const { user } = UseContextCheck();

  return (
    <div className="Dashboard-Container">
      <div className="Welcome-Networth-Profile-Container">
        <div className="Welcome-Networth-Container">
          <div className="Welcome-Container">
            {user ? `Welcome, ${user.firstName}` : "Welcome, guest"}
          </div>
          <div className="NetWorth-Container">
            <Networth />
          </div>
        </div>
        <Profile />
      </div>
      <div className="Recent-Activity-Investments-Summary-Container">
        <RecentActivity />
        <div className="Investments-Summary-Container"> Investments</div>
      </div>
    </div>
  );
};

export default Dashboard;
