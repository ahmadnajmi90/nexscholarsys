import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import AcademicianDashboard from '@/Pages/Dashboard/AcademicianDashboard';
import AdminDashboard from '@/Pages/Dashboard/AdminDashboard';
import FacultyAdminDashboard from '@/Pages/Dashboard/FacultyAdminDashboard';
import useRoles from "@/Hooks/useRoles";
import useIsDesktop from "@/Hooks/useIsDesktop";
import { Head } from '@inertiajs/react';

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
  userMotivationData,
  facultyAdminDashboardData,
}) => {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const isDesktop = useIsDesktop();

  // Render AdminDashboard for admin users
  if (isAdmin) {
    return (
      <MainLayout>
        <Head title="Dashboard" />
        <AdminDashboard
          posts={posts}
          events={events}
          projects={projects}
          grants={grants}
          totalUsers={totalUsers}
          topViewedAcademicians={topViewedAcademicians}
          analyticsData={analyticsData}
          userMotivationData={userMotivationData}
        />
      </MainLayout>
    );
  }

  // Render FacultyAdminDashboard for faculty admin users
  if (isFacultyAdmin) {
    return (
      <MainLayout>
        <Head title="Dashboard" />
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
        <Head title="Dashboard" />
        <AcademicianDashboard
          posts={posts}
          events={events}
          projects={projects}
          grants={grants}
        />
      </MainLayout>
    );
  }
};

export default Dashboard;