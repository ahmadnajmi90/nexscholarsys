import React, { useState } from 'react';
import { FaBullseye, FaStar, FaCommentDots } from 'react-icons/fa';

const UserMotivationAnalytics = ({ motivationData }) => {
    const [activeTab, setActiveTab] = useState('mainReason');

    if (!motivationData || (!motivationData.mainReasons?.length && !motivationData.featuresInterested?.length)) {
        return null; // Don't render if no data
    }

    const tabs = [
        { id: 'mainReason', label: 'Main Reasons for Joining', icon: <FaBullseye /> },
        { id: 'features', label: 'Most Anticipated Features', icon: <FaStar /> },
        { id: 'feedback', label: 'Recent Feedback', icon: <FaCommentDots /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'mainReason':
                return <AnalyticsList data={motivationData.mainReasons} />;
            case 'features':
                return <AnalyticsList data={motivationData.featuresInterested} />;
            case 'feedback':
                return <FeedbackList data={motivationData.latestFeedback} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-2 sm:space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 px-2 sm:px-1 border-b-2 font-medium text-sm flex items-center`}
                            title={tab.label}
                        >
                            {React.cloneElement(tab.icon, { className: 'w-4 h-4 sm:mr-2' })}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

const AnalyticsList = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-sm text-gray-500">No data available for this category.</p>;
    }
    
    const maxCount = Math.max(...data.map(item => item.count), 0);

    return (
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {data.map((item, index) => (
                <div key={index}>
                    <div className="flex justify-between items-start mb-1 gap-2">
                        <p className="text-sm text-gray-700 flex-1 min-w-0" title={item.label}>
                            <span className="block sm:hidden">
                                {item.label.length > 60 ? `${item.label.substring(0, 60)}...` : item.label}
                            </span>
                            <span className="hidden sm:block">
                                {item.label}
                            </span>
                        </p>
                        <p className="text-sm font-bold text-gray-800 flex-shrink-0">{item.count}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const FeedbackList = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-sm text-gray-500">No recent feedback submitted.</p>;
    }

    return (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {data.map((feedback, index) => (
                <blockquote key={index} className="border-l-4 border-gray-200 pl-3 sm:pl-4 text-sm text-gray-600 italic">
                    <span className="block sm:hidden">
                        "{feedback.length > 100 ? `${feedback.substring(0, 100)}...` : feedback}"
                    </span>
                    <span className="hidden sm:block">
                        "{feedback}"
                    </span>
                </blockquote>
            ))}
        </div>
    );
}

export default UserMotivationAnalytics;
