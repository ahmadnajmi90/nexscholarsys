import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import MainLayout from '@/Layouts/MainLayout';
import PostContent from './Partials/PostContent';

export default function Show() {
  const { post, auth, academicians, postgraduates, undergraduates, previous, next } = usePage().props;
  
  return (
    <MainLayout auth={auth}>
      <PostContent 
        post={post} 
        academicians={academicians} 
        postgraduates={postgraduates} 
        undergraduates={undergraduates}
        isWelcome={false}
        auth={auth}
        previous={previous}
        next={next}
      />
    </MainLayout>
  );
}
