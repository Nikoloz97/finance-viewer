import "./Dashboard.css";
import Profile from "./Profile/Profile";
import RecentActivity from "./RecentActivity";
import Networth from "./Networth";

const Dashboard = () => {
  return (
    <div className="Dashboard-Container">
      <div className="Networth-Profile-Container">
        <div className="NetWorth-Container">
          <Networth />
        </div>
        <div className="Profile-Container">
          <Profile />
        </div>
      </div>
      <div className="Recent-Activity-Investments-Summary-Container">
        <RecentActivity />
        <div className="Investments-Summary-Container"> Investments</div>
      </div>
    </div>
  );
};

export default Dashboard;
