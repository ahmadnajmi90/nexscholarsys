import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileContent from './partials/ProfileContent';

const PostgraduateProfile = ({ auth, postgraduate, university, faculty, user, researchOptions, metaTags, skillsOptions }) => {
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

            <ProfileContent
                profile={postgraduate}
                university={university}
                faculty={faculty}
                user={user}
                researchOptions={researchOptions}
                type="postgraduate"
                skillsOptions={skillsOptions}
            />
        </MainLayout>
    );
};

export default PostgraduateProfile; 