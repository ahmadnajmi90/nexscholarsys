import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import MainLayout from '@/Layouts/MainLayout';
import GrantContent from './Partials/GrantContent';

export default function Show() {
  const { grant, auth, academicians, previous, next, relatedGrants } = usePage().props;
  return (
    <MainLayout auth={auth}>
      <GrantContent 
        grant={grant} 
        academicians={academicians}
        isWelcome={false}
        auth={auth}
        previous={previous}
        next={next}
        relatedGrants={relatedGrants}
      />
    </MainLayout>
  );
}
