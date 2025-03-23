import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import WelcomeLayout from '@/Layouts/WelcomeLayout';
import ProjectContent from './Partials/ProjectContent';

export default function WelcomeProjectShow() {
  const { project, auth, academicians, researchOptions, universities, relatedProjects } = usePage().props;
  
  return (
    <WelcomeLayout auth={auth}>
      <ProjectContent 
        project={project} 
        academicians={academicians}
        researchOptions={researchOptions}
        isWelcome={true}
        auth={auth}
        universities={universities}
        relatedProjects={relatedProjects}
      />
    </WelcomeLayout>
  );
}
