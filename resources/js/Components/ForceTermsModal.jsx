import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function ForceTermsModal({ show, onClose }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('terms');
    const [termsContent, setTermsContent] = useState('');
    const [privacyContent, setPrivacyContent] = useState('');
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [isAgreeing, setIsAgreeing] = useState(false);

    useEffect(() => {
        if (show) {
            const contentToFetch = activeTab === 'terms' ? termsContent : privacyContent;
            const routeName = activeTab === 'terms' ? 'api.legal.terms' : 'api.legal.privacy';
            const setContent = activeTab === 'terms' ? setTermsContent : setPrivacyContent;

            if (!contentToFetch) {
                setIsLoadingContent(true);
                window.axios.get(route(routeName))
                    .then(response => {
                        setContent(response.data.content);
                    })
                    .catch(error => console.error(`Failed to fetch ${activeTab} content`, error))
                    .finally(() => setIsLoadingContent(false));
            }
        }
    }, [show, activeTab]);

    const renderHtmlContent = (markdown) => {
        if (!markdown) return '';
        return markdown
            .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mt-4 mb-4">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-gray-900 mt-4 mb-2">$1</h3>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 hover:text-indigo-800 underline">$1</a>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/(<h[1-3][^>]*>.*?<\/h[1-3]>)\s*\n/g, '$1')
            .replace(/\n(?=## )/g, '')
            .replace(/\n(?=### )/g, '')
            .replace(/\n(?=# )/g, '')
            .replace(/\n/g, '<br />');
    };

    const handleAgree = async () => {
        setIsAgreeing(true);
        try {
            await window.axios.post(route('user.agree-to-terms'));
            window.location.reload();
        } catch (error) {
            console.error('Failed to agree to terms:', error);
            setIsAgreeing(false);
        }
    };

    return (
        <Modal show={show} maxWidth="2xl">
            <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center pb-3 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Terms Agreement Required
                    </h2>
                </div>

                <div className="flex justify-center flex-shrink-0 mb-4">
                    <div className="inline-flex items-center px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-amber-800">
                            You must agree to our updated terms to continue using the platform
                        </span>
                    </div>
                </div>

                <div className="prose max-w-none flex-grow overflow-y-auto max-h-[50vh]">
                    {isLoadingContent ? (
                        <p>Loading...</p>
                    ) : (
                        <div
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: renderHtmlContent(activeTab === 'terms' ? termsContent : privacyContent)
                            }}
                        />
                    )}
                </div>

                <div className="mt-6 flex justify-center flex-shrink-0">
                    <nav className="flex space-x-2 bg-gray-50 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                activeTab === 'terms' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:bg-white'
                            }`}
                        >
                            Terms of Use
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                activeTab === 'privacy' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:bg-white'
                            }`}
                        >
                            Privacy Policy
                        </button>
                    </nav>
                </div>

                <div className="mt-6 flex justify-center flex-shrink-0">
                    <button
                        onClick={handleAgree}
                        disabled={isAgreeing}
                        className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
                            isAgreeing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isAgreeing ? 'Agreeing...' : 'I Have Read and Agree'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
