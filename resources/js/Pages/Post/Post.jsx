import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import PostCard from './Partials/PostCard';

const Post = ({ posts }) => {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  
  return (
    <MainLayout title="Posts">
      <PostCard posts={posts} />
    </MainLayout>
  );
};

export default Post;
