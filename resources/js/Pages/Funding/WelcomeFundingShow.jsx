import React from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import WelcomeLayout from '@/Layouts/WelcomeLayout';
import FundingContent from './Partials/FundingContent';

export default function WelcomeFundingShow() {
    const { fundingItem, auth, academicians, relatedFunding } = usePage().props;
    return (
        <WelcomeLayout auth={auth}>
            <Head title={fundingItem.title} />
            <FundingContent
                fundingItem={fundingItem}
                academicians={academicians}
                isWelcome={true}
                auth={auth}
                relatedFunding={relatedFunding}
            />
        </WelcomeLayout>
    );
}
