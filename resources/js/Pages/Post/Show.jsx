import React from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import MainLayout from '@/Layouts/MainLayout';
import PostContent from './Partials/PostContent';

export default function Show() {
  const { post, auth, academicians, postgraduates, undergraduates, previous, next, metaTags, relatedPosts } = usePage().props;
  
  return (
    <MainLayout auth={auth}>
      <Head title={post.title} />
      <PostContent 
        post={post} 
        academicians={academicians} 
        postgraduates={postgraduates} 
        undergraduates={undergraduates}
        isWelcome={false}
        auth={auth}
        previous={previous}
        next={next}
        metaTags={metaTags}
        relatedPosts={relatedPosts}
      />
    </MainLayout>
  );
}
