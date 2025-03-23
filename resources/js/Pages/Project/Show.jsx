import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import MainLayout from '@/Layouts/MainLayout';
import ProjectContent from './Partials/ProjectContent';

export default function Show() {
  const { project, auth, academicians, previous, next, researchOptions, universities, relatedProjects } = usePage().props;
  console.log(relatedProjects);
  return (
    <MainLayout auth={auth}>
      <ProjectContent 
        project={project} 
        academicians={academicians}
        isWelcome={false}
        auth={auth}
        researchOptions={researchOptions}
        previous={previous}
        next={next}
        universities={universities}
        relatedProjects={relatedProjects}
      />
    </MainLayout>
  );
}
