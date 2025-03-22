import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import WelcomeLayout from '@/Layouts/WelcomeLayout';
import PostContent from './Partials/PostContent';

export default function WelcomePostShow() {
  const { post, auth, academicians, postgraduates, undergraduates, metaTags } = usePage().props;
  
  return (
    <WelcomeLayout auth={auth}>
      <PostContent 
        post={post} 
        academicians={academicians} 
        postgraduates={postgraduates} 
        undergraduates={undergraduates}
        isWelcome={true}
        auth={auth}
        metaTags={metaTags}
      />
    </WelcomeLayout>
  );
}
