import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import WelcomeLayout from '@/Layouts/WelcomeLayout';
import GrantContent from './Partials/GrantContent';

export default function WelcomeGrantShow() {
  const { grant, auth, academicians } = usePage().props;
  
  return (
    <WelcomeLayout auth={auth}>
      <GrantContent 
        grant={grant} 
        academicians={academicians}
        isWelcome={true}
        auth={auth}
      />
    </WelcomeLayout>
  );
}
