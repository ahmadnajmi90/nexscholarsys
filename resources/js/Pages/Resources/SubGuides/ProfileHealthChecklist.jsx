import React, { useState } from 'react';
import { Heart, CheckCircle, AlertTriangle, XCircle, BarChart3, Target, FileText, Award, Star } from 'lucide-react';

const ProfileHealthChecklist = () => {
    // Initialize all checkboxes as checked by default
    const [checkedItems, setCheckedItems] = useState({
        // Section 1: 3 items
        profilePicture: true,
        emailVerified: true,
        motivationShared: true,
        // Section 2: 3 items
        cvUploaded: true,
        researchFieldsCompleted: true,
        bioWritten: true,
        // Section 3: 3 items
        roleSpecificInfo: true,
        googleScholarSynced: true,
        skillsPopulated: true,
        // Section 4: 2 items
        firstConnection: true,
        contentShared: true,
    });

    const handleCheckboxChange = (itemName) => {
        setCheckedItems(prev => ({
            ...prev,
            [itemName]: !prev[itemName]
        }));
    };

    // Calculate progress for each section
    const calculateSectionProgress = (sectionItems, targetPercentage, sectionId) => {
        const checkedCount = sectionItems.filter(item => checkedItems[item]).length;
        const totalItems = sectionItems.length;
        const uncheckedCount = totalItems - checkedCount;

        let deductionPerItem = 0;

        // Different deduction rates per section
        if (sectionId === 2) {
            // Section 2: each unchecked item deducts 10%, minimum 30%
            deductionPerItem = 10;
            const minimum = 30;
            const calculated = targetPercentage - (uncheckedCount * deductionPerItem);
            return Math.max(calculated, minimum);
        } else if (sectionId === 3) {
            // Section 3: each unchecked item deducts 10%, minimum 60%
            deductionPerItem = 10;
            const minimum = 60;
            const calculated = targetPercentage - (uncheckedCount * deductionPerItem);
            return Math.max(calculated, minimum);
        } else if (sectionId === 4) {
            // Section 4: each unchecked item deducts 5%, minimum 90%
            deductionPerItem = 5;
            const minimum = 90;
            const calculated = targetPercentage - (uncheckedCount * deductionPerItem);
            return Math.max(calculated, minimum);
        } else {
            // Section 1: original logic
            return targetPercentage * (checkedCount / totalItems);
        }
    };

    // Section configurations
    const sections = [
        {
            id: 1,
            items: ['profilePicture', 'emailVerified', 'motivationShared'],
            targetPercentage: 30,
            color: 'blue'
        },
        {
            id: 2,
            items: ['cvUploaded', 'researchFieldsCompleted', 'bioWritten'],
            targetPercentage: 60,
            color: 'green'
        },
        {
            id: 3,
            items: ['roleSpecificInfo', 'googleScholarSynced', 'skillsPopulated'],
            targetPercentage: 90,
            color: 'purple'
        },
        {
            id: 4,
            items: ['firstConnection', 'contentShared'],
            targetPercentage: 100,
            color: 'orange'
        }
    ];

    // Calculate total progress
    const totalProgress = sections.reduce((total, section) => {
        return total + calculateSectionProgress(section.items, section.targetPercentage, section.id);
    }, 0);

    const maxProgress = sections.reduce((total, section) => total + section.targetPercentage, 0);
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    Your Nexscholar Profile Health Checklist
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Is your Nexscholar profile working as hard as you are? A complete profile doesn't just look good—it unlocks the full power of our AI matching engine, increases your visibility, and brings the best opportunities directly to you.
                </p>
                <p className="text-gray-700 mt-4">
                    Use this checklist to perform a quick "health check." Each item you tick off brings you closer to a 100% optimized profile, ready for discovery.
                </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {/* Section 1: The Essentials */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Section 1: The Essentials (Your Foundation)</h2>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">30% Complete</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        These are the first steps that verify your identity and secure your account.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.profilePicture}
                                onChange={() => handleCheckboxChange('profilePicture')}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">Profile Picture Added</h3>
                                <p className="text-gray-700 text-sm">A professional headshot makes your profile more personal and significantly increases views.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.emailVerified}
                                onChange={() => handleCheckboxChange('emailVerified')}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">Email Address Verified</h3>
                                <p className="text-gray-700 text-sm">This is crucial for account security and ensures you never miss an important notification or connection request.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.motivationShared}
                                onChange={() => handleCheckboxChange('motivationShared')}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">"Why Nexscholar" Motivation Shared</h3>
                                <p className="text-gray-700 text-sm">Telling us your goals helps us tailor and improve the platform to better suit your needs.</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-medium text-gray-700">{Math.round(calculateSectionProgress(sections[0].items, sections[0].targetPercentage, sections[0].id))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: `${calculateSectionProgress(sections[0].items, sections[0].targetPercentage, sections[0].id)}%` }}></div>
                        </div>
                    </div>
                </section>

                {/* Section 2: The Academic Core */}
                <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Section 2: The Academic Core (Your AI Fuel)</h2>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">60% Complete</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        This section is the most critical for powering our semantic search and AI matching features.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.cvUploaded}
                                onChange={() => handleCheckboxChange('cvUploaded')}
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">Latest CV Uploaded</h3>
                                <p className="text-gray-700 text-sm">Have you uploaded your most recent CV? Our AI uses this to auto-fill and enrich your profile, saving you time and ensuring accuracy.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.researchFieldsCompleted}
                                onChange={() => handleCheckboxChange('researchFieldsCompleted')}
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">Structured Research Fields Completed</h3>
                                <p className="text-gray-700 text-sm">This is the most important step for our AI! Don't just select a broad "Field of Research." Have you drilled down to select your specific Research Areas and Niche Domains? This is the key to getting hyper-relevant matches.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.bioWritten}
                                onChange={() => handleCheckboxChange('bioWritten')}
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">Detailed Bio Written</h3>
                                <p className="text-gray-700 text-sm">Have you written a descriptive bio in your profile settings? Our AI reads this to understand the story and context behind your work, leading to more nuanced matches.</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-medium text-gray-700">{Math.round(calculateSectionProgress(sections[1].items, sections[1].targetPercentage, sections[1].id))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full transition-all duration-300" style={{ width: `${calculateSectionProgress(sections[1].items, sections[1].targetPercentage, sections[1].id)}%` }}></div>
                        </div>
                    </div>

                    {/* Image Placeholder */}
                    <div className="mt-4 sm:mt-6 lg:mt-8 bg-gray-100 rounded-lg p-4 sm:p-6 lg:p-8 text-center">
                        <img
                            src="/images/resources/1.3.1.png"
                            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                        />
                    </div>
                </section>

                {/* Section 3: The Professional Details */}
                <section className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Section 3: The Professional Details (Your Credentials)</h2>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">90% Complete</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        This is where you showcase your specific qualifications and accomplishments.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.roleSpecificInfo}
                                onChange={() => handleCheckboxChange('roleSpecificInfo')}
                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">Role-Specific Info is Filled Out</h3>
                                <div className="text-gray-700 text-sm space-y-2">
                                    <div><strong>Academicians:</strong> Is your current Position and Faculty listed and verified?</div>
                                    <div><strong>Postgraduates:</strong> Is your current Degree and Field of Research accurate?</div>
                                    <div><strong>Undergraduates:</strong> Have you added your Degree and Research Preference?</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.googleScholarSynced}
                                onChange={() => handleCheckboxChange('googleScholarSynced')}
                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">(For Academicians) Google Scholar Profile is Synced</h3>
                                <p className="text-gray-700 text-sm">Have you linked your Google Scholar URL and imported your publications? This is the best way to showcase your research output and citation metrics.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.skillsPopulated}
                                onChange={() => handleCheckboxChange('skillsPopulated')}
                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">Skills Section is Populated</h3>
                                <p className="text-gray-700 text-sm">Have you listed your key technical, lab, software, or analytical skills? This helps others find you for collaboration.</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-medium text-gray-700">{Math.round(calculateSectionProgress(sections[2].items, sections[2].targetPercentage, sections[2].id))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-purple-500 h-3 rounded-full transition-all duration-300" style={{ width: `${calculateSectionProgress(sections[2].items, sections[2].targetPercentage, sections[2].id)}%` }}></div>
                        </div>
                    </div>
                </section>

                {/* Section 4: The Extra Mile */}
                <section className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Star className="w-6 h-6 text-orange-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Section 4: The Extra Mile (Profile Perfection)</h2>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">100% Complete!</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Go from a static profile to a dynamic presence on the platform.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.firstConnection}
                                onChange={() => handleCheckboxChange('firstConnection')}
                                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">First Connection is Made</h3>
                                <p className="text-gray-700 text-sm">Have you started building your network? Send a connection request to a colleague or a potential supervisor to get started.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={checkedItems.contentShared}
                                onChange={() => handleCheckboxChange('contentShared')}
                                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 mt-1"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">Content is Shared or Bookmarked</h3>
                                <p className="text-gray-700 text-sm">Have you created your first Post, shared a Project, or bookmarked content from others? An active profile gets more visibility in the community.</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-medium text-gray-700">{Math.round(calculateSectionProgress(sections[3].items, sections[3].targetPercentage, sections[3].id))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-orange-500 h-3 rounded-full transition-all duration-300" style={{ width: `${calculateSectionProgress(sections[3].items, sections[3].targetPercentage, sections[3].id)}%` }}></div>
                        </div>
                    </div>
                </section>

                {/* Congratulations Section */}
                <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 sm:p-6 lg:p-8 text-white text-center">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-4">🎉 Congratulations!</h2>
                        <p className="text-green-100 text-lg leading-relaxed">
                            A 100% complete profile is your passport to new collaborations, funding, and career opportunities on Nexscholar. Now that your profile is in top shape, go explore your AI-powered matches!
                        </p>
                    </div>

                    <a
                        href="/role"
                        className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2"
                    >
                        <BarChart3 className="w-5 h-5" />
                        Identify Your Profile Health
                    </a>
                </section>
            </div>
        </div>
    );
};

export default ProfileHealthChecklist;
