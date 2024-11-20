import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import QuickActions from "./QuickActions";
import TrendsChart from "./TrendsChart";
import UpcomingConferences from "./UpcomingConferences";

const DashboardInsight  = () => {


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
