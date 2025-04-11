import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AcademicianPublicationsCard from './partials/AcademicianPublicationsCard';

const AcademicianPublications = ({ 
    auth, 
    academician, 
    university, 
    faculty, 
    user, 
    publications, 
    scholarProfile,
    researchOptions,
    metaTags 
}) => {
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

            <AcademicianPublicationsCard 
                academician={academician}
                university={university}
                faculty={faculty}
                user={user}
                publications={publications}
                scholarProfile={scholarProfile}
                researchOptions={researchOptions}
            />
        </MainLayout>
    );
};

export default AcademicianPublications; 