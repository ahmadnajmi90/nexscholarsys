import React from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import MainLayout from '@/Layouts/MainLayout';
import FundingContent from './Partials/FundingContent';

export default function Show() {
    const { fundingItem, auth, academicians, relatedFunding } = usePage().props;
    return (
        <MainLayout auth={auth}>
            <Head title={fundingItem.title} />
            <FundingContent
                fundingItem={fundingItem}
                academicians={academicians}
                isWelcome={false}
                auth={auth}
                relatedFunding={relatedFunding}
            />
        </MainLayout>
    );
}
