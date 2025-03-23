import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import WelcomeLayout from '@/Layouts/WelcomeLayout';
import EventContent from './Partials/EventContent';

export default function WelcomeEventShow() {
  const { event, auth, academicians, researchOptions, relatedEvents } = usePage().props;
  
  return (
    <WelcomeLayout auth={auth}>
      <EventContent 
        event={event} 
        academicians={academicians}
        researchOptions={researchOptions}
        isWelcome={true}
        auth={auth}
        relatedEvents={relatedEvents}
      />
    </WelcomeLayout>
  );
}
