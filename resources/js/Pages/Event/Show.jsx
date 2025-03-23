import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import MainLayout from '@/Layouts/MainLayout';
import EventContent from './Partials/EventContent';

export default function Show() {
  const { event, auth, academicians, researchOptions, relatedEvents } = usePage().props;
  return (
    <MainLayout auth={auth}>
      <EventContent 
        event={event} 
        academicians={academicians}
        isWelcome={false}
        auth={auth}
        researchOptions={researchOptions}
        relatedEvents={relatedEvents}
      />
    </MainLayout>
  );
}
