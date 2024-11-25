import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PostingCard from '@/Components/PostingCard';

const Grant = ( { grants, isPostgraduate, users} ) => {
    console.log(grants);
    return (
        <MainLayout title="Grant" isPostgraduate={isPostgraduate}>
            <div className="container mx-auto px-4">
                <PostingCard 
                data={grants} 
                title="title" 
                isProject={false}
                isEvent={false}
                isGrant={true}/>
            </div>
        </MainLayout>
    );
};

export default Grant;
