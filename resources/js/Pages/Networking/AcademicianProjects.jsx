import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AcademicianProjectsCard from './partials/AcademicianProjectsCard';

const AcademicianProjects = ({ auth, academician, university, faculty, user, projects, researchOptions }) => {
    // SEO Meta Tags
    const metaTitle = `${academician.full_name} - Projects | NexScholar`;
    const metaDescription = `Browse research projects by ${academician.full_name} at ${university?.full_name}`;
    
    const metaTags = {
        title: metaTitle,
        description: metaDescription,
        image: academician.profile_picture 
            ? `/storage/${academician.profile_picture}` 
            : '/images/default-avatar.jpg',
        type: 'profile',
        url: route('academicians.projects', academician.url),
    };

    return (
        <MainLayout>
            <Head>
                <title>{metaTags.title}</title>
                <meta name="description" content={metaTags.description} />
                <meta property="og:title" content={metaTags.title} />
                <meta property="og:description" content={metaTags.description} />
                <meta property="og:image" content={metaTags.image} />
                <meta property="og:type" content={metaTags.type} />
                <meta property="og:url" content={metaTags.url} />
            </Head>

            <AcademicianProjectsCard 
                academician={academician}
                university={university}
                faculty={faculty}
                user={user}
                projects={projects}
                researchOptions={researchOptions}
            />
        </MainLayout>
    );
};

export default AcademicianProjects; 