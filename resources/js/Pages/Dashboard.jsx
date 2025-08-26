import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import DashboardInsights from '@/Components/Dashboard/DashboardInsights';
import Dashboard_m from "@/Components/Dashboard/Dashboard_m";
import AcademicianDashboard from '@/Pages/Dashboard/AcademicianDashboard';
import AdminDashboard from '@/Pages/Dashboard/AdminDashboard';
import FacultyAdminDashboard from '@/Pages/Dashboard/FacultyAdminDashboard';
import useRoles from "@/Hooks/useRoles";
import useIsDesktop from "@/Hooks/useIsDesktop";

const Dashboard = ({
  totalUsers,
  onlineUsers,
  posts,
  events,
  projects,
  grants,
  academicians,
  universities,
  faculties,
  users,
  researchOptions,
  profileIncompleteAlert,
  topViewedAcademicians,
  analyticsData,
  facultyAdminDashboardData,
}) => {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const isDesktop = useIsDesktop();
  console.log(events)

  // Render AdminDashboard for admin users
  if (isAdmin) {
    return (
      <MainLayout>
        <AdminDashboard
          posts={posts}
          events={events}
          projects={projects}
          grants={grants}
          totalUsers={totalUsers}
          topViewedAcademicians={topViewedAcademicians}
          analyticsData={analyticsData}
        />
      </MainLayout>
    );
  }

  // Render FacultyAdminDashboard for faculty admin users
  if (isFacultyAdmin) {
    return (
      <MainLayout>
        <FacultyAdminDashboard
          posts={posts}
          events={events}
          projects={projects}
          grants={grants}
          facultyAdminDashboardData={facultyAdminDashboardData}
        />
      </MainLayout>
    );
  }

  // Render the new AcademicianDashboard for academician, postgraduate, and undergraduate roles
  if (isAcademician || isPostgraduate || isUndergraduate) {
    return (
      <MainLayout>
        <AcademicianDashboard
          posts={posts}
          events={events}
          projects={projects}
          grants={grants}
        />
      </MainLayout>
    );
  }

  // For other roles, use the existing dashboard components
  return (
    <MainLayout>
      {isDesktop ? (
        <DashboardInsights
          totalUsers={totalUsers}
          onlineUsers={onlineUsers}
          posts={posts}
          events={events}
          projects={projects}
          grants={grants}
          academicians={academicians}
          universities={universities}
          faculties={faculties}
          users={users}
          researchOptions={researchOptions}
          profileIncompleteAlert={profileIncompleteAlert}
          topViewedAcademicians={topViewedAcademicians}
          analyticsData={analyticsData}
          facultyAdminDashboardData={facultyAdminDashboardData}
        />
      ) : (
        <Dashboard_m
          totalUsers={totalUsers}
          onlineUsers={onlineUsers}
          posts={posts}
          events={events}
          projects={projects}
          grants={grants}
          academicians={academicians}
          universities={universities}
          faculties={faculties}
          users={users}
          researchOptions={researchOptions}
          profileIncompleteAlert={profileIncompleteAlert}
          topViewedAcademicians={topViewedAcademicians}
          analyticsData={analyticsData}
          facultyAdminDashboardData={facultyAdminDashboardData}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;