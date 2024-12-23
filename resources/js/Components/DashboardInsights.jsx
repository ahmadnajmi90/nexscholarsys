import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import QuickActions from "./QuickActions";
import TrendsChart from "./TrendsChart";
import UpcomingEvents from "./UpcomingEvents";
import RegisteredUser from "./RegsiteredUser";
import OnlineUser from "./OnlineUser";
import ClicksByType from "./ClicksByType";
import SuccessAlert4 from "./WelcomeMessage";
import ProfileCard from "./ProfileCard";

const DashboardInsight  = ( { totalUsers, onlineUsers, clicksByType, isAdmin, events, isFacultyAdmin, academicians, universities, faculties, users, researchOptions } ) => {
  return (
    <div className="p-6 min-h-screen">

{/* <SuccessAlert4 /> */}

      {isAdmin && (
        <>
        <div className="col-span-1 md:col-span-3 mb-6">
          <button
            onClick={() => window.location.href = '/admin/faculty-admins'}
            className="w-full bg-black text-white py-2 px-4 rounded"
          >
            Create Faculty Admin
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <RegisteredUser totalUsers={totalUsers} />

          <OnlineUser onlineUsers={onlineUsers} />

          <ClicksByType clicksByType={clicksByType} />

        </div>
        </>
      )}

      
      {isFacultyAdmin && (
        <>
        <ProfileCard 
          profilesData={academicians} 
          supervisorAvailabilityKey="availability_as_supervisor" 
          universitiesList={universities}
          faculties={faculties}
          isPostgraduateList={false}
          users={users}
          researchOptions={researchOptions}/>
        </>
      )}


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* Left Section */}
        <QuickActions />

        {/* Trends Section */}
        <TrendsChart />

        {/* Upcoming Events */}
        <UpcomingEvents events={events}/>
      </div>

    </div>
  );
};

export default DashboardInsight;
