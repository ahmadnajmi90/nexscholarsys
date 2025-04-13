import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaRegClock, FaThumbsUp, FaShare, FaTimesCircle, FaUniversity } from 'react-icons/fa';
import MainLayout from '@/Layouts/MainLayout';
import EventContent from './Partials/EventContent';
import BookmarkButton from '@/Components/BookmarkButton';

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
