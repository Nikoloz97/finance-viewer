import React from "react";
import "./Dashboard.css";

const Home = () => {
  return (
    <div className="Dashboard-Container">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "50%",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            gap: "20px",
          }}
        >
          <div className="Welcome-Container">Welcome, guest</div>
          <div className="NetWorth-Container"> Net Worth</div>
        </div>
        <div className="Profile-Container"> Profile</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "50%",
          gap: "20px",
        }}
      >
        <div className="Recent-Activity-Container">Recent Activity</div>
        <div className="Investment-Summary-Container"> Investments</div>
      </div>
    </div>
  );
};

export default Home;
