import React from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import WelcomeLayout from '@/Layouts/WelcomeLayout';
import PostContent from './Partials/PostContent';

export default function WelcomePostShow() {
  const { post, auth, academicians, postgraduates, undergraduates, metaTags, relatedPosts } = usePage().props;
  
  return (
    <WelcomeLayout auth={auth}>
      <Head title={post.title} />
        <PostContent 
        post={post} 
        academicians={academicians} 
        postgraduates={postgraduates} 
        undergraduates={undergraduates}
        isWelcome={true}
        auth={auth}
        metaTags={metaTags}
        relatedPosts={relatedPosts}
      />
    </WelcomeLayout>
  );
}
