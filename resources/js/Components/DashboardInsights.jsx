import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import QuickActions from "./QuickActions";
import TrendsChart from "./TrendsChart";
import UpcomingConferences from "./UpcomingConferences";
import RegisteredUser from "./RegsiteredUser";
import OnlineUser from "./OnlineUser";
import ClicksByType from "./ClicksByType";

const DashboardInsight  = ( { totalUsers, onlineUsers, clicksByType, isAdmin } ) => {
  return (
    <div className="p-6 min-h-screen">
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Left Section */}
          <RegisteredUser totalUsers={totalUsers} />

          {/* Trends Section */}
          <OnlineUser onlineUsers={onlineUsers} />

          {/* Upcoming Conferences */}
          <ClicksByType clicksByType={clicksByType} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Left Section */}
        <QuickActions />

        {/* Trends Section */}
        <TrendsChart />

        {/* Upcoming Conferences */}
        <UpcomingConferences />
      </div>
    </div>
  );
};

export default DashboardInsight;
