import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TutorialConfirmationModal from '@/Components/Tutorial/TutorialConfirmationModal';
import TutorialSkipModal from '@/Components/Tutorial/TutorialSkipModal';

export default function TutorialModal({ show, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);
    const { auth } = usePage().props;

    const tutorialSteps = [
        {
            id: 'welcome',
            title: 'Welcome to Nexscholar! 🎉',
            icon: '🎓',
            content: (
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    <div className="text-center">
                        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-3 sm:mb-4">
                            <strong className="text-indigo-600">Nexscholar</strong> is your academic networking and research collaboration platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                    <span className="text-blue-600 text-xs sm:text-sm">👥</span>
                                </div>
                                <span className="font-medium text-gray-800 text-sm sm:text-base">Connect</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 ml-9 sm:ml-11">with supervisors, students, and collaborators</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg border border-green-100">
                            <div className="flex items-center mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                    <span className="text-green-600 text-xs sm:text-sm">📝</span>
                                </div>
                                <span className="font-medium text-gray-800 text-sm sm:text-base">Share</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 ml-9 sm:ml-11">research projects, events, and funding opportunities</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <span className="text-purple-600 text-sm sm:text-base">🚀</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Your Academic Journey Starts Here</h4>
                                <p className="text-xs sm:text-sm text-gray-600">Join thousands of researchers building meaningful connections and advancing knowledge together.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'profile',
            title: 'Build Your Profile',
            icon: '👤',
            content: (
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    <div className="text-center mb-3 sm:mb-4">
                        <p className="text-sm sm:text-base md:text-lg text-gray-700">Create a comprehensive profile that showcases your academic identity and expertise.</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 sm:p-4 md:p-5 rounded-lg border border-indigo-100">
                        <div className="flex items-center mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <span className="text-indigo-600 text-sm sm:text-base">🎭</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">Role-Based Profiles</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 ml-11 sm:ml-12 md:ml-14">
                            <div className="bg-white p-2 sm:p-3 rounded-lg border border-indigo-200">
                                <span className="text-xs sm:text-sm font-medium text-indigo-700">Academician</span>
                            </div>
                            <div className="bg-white p-2 sm:p-3 rounded-lg border border-indigo-200">
                                <span className="text-xs sm:text-sm font-medium text-indigo-700">Postgraduate</span>
                            </div>
                            <div className="bg-white p-2 sm:p-3 rounded-lg border border-indigo-200">
                                <span className="text-xs sm:text-sm font-medium text-indigo-700">Undergraduate</span>
                            </div>
                            <div className="bg-white p-2 sm:p-3 rounded-lg border border-indigo-200">
                                <span className="text-xs sm:text-sm font-medium text-indigo-700">Industry</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-3 sm:p-4 md:p-5 rounded-lg border border-emerald-100">
                        <div className="flex items-center mb-2 sm:mb-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <span className="text-emerald-600 text-sm sm:text-base">🤖</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">AI Profile Generation</h4>
                                <p className="text-xs sm:text-sm text-gray-600">Quick setup from CV, URLs, or automatic search</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2 ml-11 sm:ml-12 md:ml-14">
                            <span className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">📄 CV Upload</span>
                            <span className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">🔗 Google Scholar</span>
                            <span className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">🔍 Auto Search</span>
                            <span className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">📝 Research Interests</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'content',
            title: 'Explore & Share Content',
            icon: '📚',
            content: (
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    <div className="text-center mb-3 sm:mb-4">
                        <p className="text-sm sm:text-base md:text-lg text-gray-700">Discover, create, and engage with academic content in our unified platform.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 sm:p-4 md:p-5 rounded-lg border border-blue-100">
                            <div className="flex items-center mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                    <span className="text-blue-600 text-sm sm:text-base">📝</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">Post Academic Updates</h4>
                            </div>
                            <div className="ml-11 sm:ml-12 md:ml-14 space-y-1 sm:space-y-2">
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 sm:mr-3"></span>
                                    Research projects and findings
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 sm:mr-3"></span>
                                    Academic events and conferences
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 sm:mr-3"></span>
                                    Publications and papers
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 sm:p-4 md:p-5 rounded-lg border border-amber-100">
                            <div className="flex items-center mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                    <span className="text-amber-600 text-sm sm:text-base">💰</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">Unified Funding Hub</h4>
                            </div>
                            <div className="ml-11 sm:ml-12 md:ml-14">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Access grants & scholarships in one centralized location</p>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    <span className="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">🎓 Research Grants</span>
                                    <span className="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">📚 Scholarships</span>
                                    <span className="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">🔬 Funding Calls</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-3 sm:p-4 md:p-5 rounded-lg border border-rose-100">
                            <div className="flex items-center mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-rose-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                    <span className="text-rose-600 text-sm sm:text-base">❤️</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">Social Engagement</h4>
                            </div>
                            <div className="ml-11 sm:ml-12 md:ml-14 flex flex-wrap gap-2 sm:gap-3">
                                <div className="flex items-center bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-rose-200">
                                    <span className="text-rose-500 mr-1 sm:mr-2 text-sm">🔖</span>
                                    <span className="text-xs sm:text-sm text-gray-700">Bookmark</span>
                                </div>
                                <div className="flex items-center bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-rose-200">
                                    <span className="text-rose-500 mr-1 sm:mr-2 text-sm">👍</span>
                                    <span className="text-xs sm:text-sm text-gray-700">Like</span>
                                </div>
                                <div className="flex items-center bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-rose-200">
                                    <span className="text-rose-500 mr-1 sm:mr-2 text-sm">📤</span>
                                    <span className="text-xs sm:text-sm text-gray-700">Share</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'projects',
            title: 'Collaborate in ScholarLab',
            icon: '📋',
            content: (
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    <div className="text-center mb-3 sm:mb-4">
                        <p className="text-sm sm:text-base md:text-lg text-gray-700">Manage research projects with powerful collaboration tools and real-time updates.</p>
                    </div>

                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-3 sm:p-4 md:p-5 rounded-lg border border-violet-100">
                        <div className="flex items-center mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-violet-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <span className="text-violet-600 text-sm sm:text-base">📊</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">Multiple View Options</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 ml-11 sm:ml-12 md:ml-14">
                            <div className="bg-white p-2 sm:p-3 rounded-lg border border-violet-200 text-center">
                                <div className="text-violet-600 mb-1 text-sm sm:text-base">📋</div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Kanban</span>
                            </div>
                            <div className="bg-white p-2 sm:p-3 rounded-lg border border-violet-200 text-center">
                                <div className="text-violet-600 mb-1 text-sm sm:text-base">📝</div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">List</span>
                            </div>
                            <div className="bg-white p-2 sm:p-3 rounded-lg border border-violet-200 text-center">
                                <div className="text-violet-600 mb-1 text-sm sm:text-base">📅</div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Calendar</span>
                            </div>
                            <div className="bg-white p-2 sm:p-3 rounded-lg border border-violet-200 text-center">
                                <div className="text-violet-600 mb-1 text-sm sm:text-base">⏱️</div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Timeline</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 sm:p-4 md:p-5 rounded-lg border border-emerald-100">
                        <div className="flex items-center mb-2 sm:mb-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <span className="text-emerald-600 text-sm sm:text-base">⚡</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">Real-Time Collaboration</h4>
                                <p className="text-xs sm:text-sm text-gray-600">WebSocket-powered instant updates</p>
                            </div>
                        </div>
                        <div className="ml-11 sm:ml-12 md:ml-14 space-y-1 sm:space-y-2">
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full mr-2 sm:mr-3"></span>
                                Live task updates and progress tracking
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full mr-2 sm:mr-3"></span>
                                Team member activity notifications
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full mr-2 sm:mr-3"></span>
                                Instant file sharing and comments
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'networking',
            title: 'Grow Your Network',
            icon: '🤝',
            content: (
                <div className="space-y-3 sm:space-y-4">
                    <div className="text-center mb-3 sm:mb-4">
                        <p className="text-sm sm:text-base md:text-lg text-gray-700">Find meaningful connections with AI-powered matching and intelligent insights.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                    <span className="text-blue-600 text-xs sm:text-sm">🎯</span>
                                </div>
                                <span className="font-medium text-gray-800 text-sm sm:text-base">AI Matching</span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                                    Find supervisors & collaborators
                                </div>
                                <div className="flex items-center">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                                    Personalized recommendations
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                    <span className="text-purple-600 text-xs sm:text-sm">💡</span>
                                </div>
                                <span className="font-medium text-gray-800 text-sm sm:text-base">Smart Insights</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">AI explains why connections are relevant</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 sm:p-4 rounded-lg border border-amber-100">
                        <div className="flex items-center mb-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                <span className="text-amber-600 text-xs sm:text-sm">🏷️</span>
                            </div>
                            <span className="font-medium text-gray-800 text-sm sm:text-base">Organize Connections</span>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                            <span className="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Students</span>
                            <span className="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Collaborators</span>
                            <span className="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Supervisors</span>
                            <span className="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Industry</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'analytics',
            title: 'Analytics & Support',
            icon: '📊',
            content: (
                <div className="space-y-3 sm:space-y-4">
                    <div className="text-center mb-3 sm:mb-4">
                        <p className="text-sm sm:text-base md:text-lg text-gray-700">Track your impact and get support whenever you need it.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-3 sm:p-4 rounded-lg border border-emerald-100">
                            <div className="flex items-center mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                    <span className="text-emerald-600 text-xs sm:text-sm">📈</span>
                                </div>
                                <span className="font-medium text-gray-800 text-sm sm:text-base">Dashboard Analytics</span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full mr-2 flex-shrink-0"></span>
                                    Platform insights & trends
                                </div>
                                <div className="flex items-center">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full mr-2 flex-shrink-0"></span>
                                    Personal network analytics
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                    <span className="text-blue-600 text-xs sm:text-sm">🎯</span>
                                </div>
                                <span className="font-medium text-gray-800 text-sm sm:text-base">Smart Recommendations</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">AI-powered suggestions based on your activity</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center mb-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                <span className="text-purple-600 text-xs sm:text-sm">❓</span>
                            </div>
                            <span className="font-medium text-gray-800 text-sm sm:text-base">Help & Support</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                            <div className="flex items-center">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                                Tutorial available anytime
                            </div>
                            <div className="flex items-center">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                                Access from profile settings
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'completion',
            title: 'Ready to Get Started!',
            icon: '🚀',
            content: (
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <span className="text-2xl sm:text-3xl">✅</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">You're All Set!</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Welcome to Nexscholar. Your academic networking journey begins now.</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 sm:p-4 md:p-5 rounded-lg border border-indigo-100">
                        <div className="flex items-center mb-2 sm:mb-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <span className="text-indigo-600 text-sm sm:text-base">💡</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">Quick Start Tips</h4>
                        </div>
                        <div className="ml-11 sm:ml-12 md:ml-14 space-y-1 sm:space-y-2">
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full mr-2 sm:mr-3"></span>
                                Complete your profile to unlock all features
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full mr-2 sm:mr-3"></span>
                                Explore the network to find collaborators
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full mr-2 sm:mr-3"></span>
                                Check out the funding hub for opportunities
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                <span className="text-gray-600 text-sm">📚</span>
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    <strong>Remember:</strong> You can always revisit this tutorial from your profile settings if you need a refresher.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setIsCompleting(true);
        try {
            await window.axios.post(route('user.mark-tutorial-seen'));
            setShowConfirmation(true);
        } catch (error) {
            console.error('Failed to mark tutorial as seen:', error);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleSkip = () => {
        setShowSkipConfirmation(true);
    };

    const handleConfirmSkip = async () => {
        setShowSkipConfirmation(false);
        setIsCompleting(true);
        try {
            await window.axios.post(route('user.mark-tutorial-seen'));
            onClose();
        } catch (error) {
            console.error('Failed to mark tutorial as seen:', error);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleCancelSkip = () => {
        setShowSkipConfirmation(false);
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
        onClose();
    };

    const currentTutorialStep = tutorialSteps[currentStep];

    return (
        <>
            <Modal show={show} maxWidth="2xl" closeable={false}>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="text-xl md:text-2xl lg:text-3xl">{currentTutorialStep.icon}</div>
                        <div>
                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                                {currentTutorialStep.title}
                            </h2>
                            <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                                Step {currentStep + 1} of {tutorialSteps.length}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSkip}
                        className="text-gray-400 hover:text-gray-600 text-xs sm:text-sm underline"
                        disabled={isCompleting || showSkipConfirmation}
                    >
                        Skip Tutorial
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 md:h-2.5 lg:h-3">
                        <div
                            className="bg-indigo-500 h-1.5 sm:h-2 md:h-2.5 lg:h-3 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-7">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[400px] flex items-center">
                        <div className="w-full py-1 sm:py-2">
                            {currentTutorialStep.content}
                        </div>
                    </div>
                                </div>


                {/* Navigation */}
                <div className="flex justify-between items-center">
                                    <button
                                        onClick={handlePrevious}
                        disabled={currentStep === 0 || showSkipConfirmation}
                        className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 ${
                            currentStep === 0 || showSkipConfirmation
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                        }`}
                                    >
                        ← Previous
                                    </button>

                    <div className="flex space-x-1 sm:space-x-2">
                        {Array.from({ length: tutorialSteps.length }, (_, index) => (
                                            <button
                                key={index}
                                onClick={() => !showSkipConfirmation && setCurrentStep(index)}
                                disabled={showSkipConfirmation}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                                    showSkipConfirmation
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : index === currentStep
                                        ? 'bg-indigo-500'
                                        : index < currentStep
                                        ? 'bg-indigo-300'
                                        : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>

                    <PrimaryButton
                        onClick={handleNext}
                        disabled={isCompleting || showSkipConfirmation}
                        className="px-4 sm:px-5 md:px-6 py-2 text-xs sm:text-sm"
                    >
                        {isCompleting ? (
                            <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Completing...
                            </div>
                        ) : currentStep === tutorialSteps.length - 1 ? (
                            'Get Started!'
                        ) : (
                            'Next →'
                        )}
                            </PrimaryButton>
                        </div>
                    </div>
                </Modal>

            {/* Confirmation Modal */}
            <TutorialConfirmationModal
                show={showConfirmation}
                onClose={handleConfirmationClose}
            />

            {/* Skip Confirmation Modal */}
            <TutorialSkipModal
                show={showSkipConfirmation}
                onClose={handleCancelSkip}
                onConfirmSkip={handleConfirmSkip}
            />
        </>
    );
}
