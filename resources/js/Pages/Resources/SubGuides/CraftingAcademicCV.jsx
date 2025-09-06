import React from 'react';
import { FileText, Target, Award, TrendingUp, Eye, Zap, CheckCircle, Upload } from 'lucide-react';

const CraftingAcademicCV = () => {
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    Crafting the Perfect Academic CV for Our AI Profile Generator
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Tired of manually filling out profile after profile? We get it. That's why we built the AI Profile Generator into Nexscholar—a powerful tool that reads your academic CV and builds your detailed professional profile in seconds, letting you focus on your research, not repetitive data entry.
                </p>
                <p className="text-gray-700 mt-4">
                    But to get the most accurate and impressive results, it helps to know how our AI thinks. This guide will show you how to structure your CV to unlock the full potential of our AI, ensuring your profile is comprehensive, impactful, and ready for networking across Malaysia and beyond.
                </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {/* How Our AI Reads Your CV */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        How Our AI Reads Your CV
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Ever wondered how a machine can understand your academic journey? Our system uses a smart, hybrid approach to understand your document:
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">📄 Direct Text Extraction</h3>
                            <p className="text-gray-700 text-sm">
                                For text-based files like DOCX and most PDFs, we perform direct text extraction for maximum accuracy. Think of it as our AI reading your CV just like you would!
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔍 OCR Fallback</h3>
                            <p className="text-gray-700 text-sm">
                                Got an image-based file or a scanned PDF? No problem! We use Optical Character Recognition (OCR) to convert those images into readable text, ensuring no valuable information is left behind.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">🧠 Intelligent Analysis</h3>
                            <p className="text-gray-700 text-sm">
                                This is where the magic happens! Our AI then analyzes this text using role-specific prompts. This means it intelligently knows to look for publications and grants if you're an Academician, or a thesis topic and lab skills if you're a Postgraduate student.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                        <p className="text-blue-800 text-sm">
                            <strong>💡 Pro Tip:</strong> By optimizing your CV for this sophisticated process, you can ensure our AI captures every important detail, transforming it into a dynamic Nexscholar profile.
                        </p>
                    </div>
                </section>

                
                {/* Hero Image Placeholder */}
                <div className="bg-gray-100 rounded-lg p-4 sm:p-6 lg:p-8 text-center">
                    <img
                        src="/images/resources/1.1.1.png"
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                    />
                </div>

                {/* The Golden Rules */}
                <section className="p-4 sm:p-6 lg:p-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                        The Golden Rules: Structuring Your CV for the AI
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Follow these essential rules to create an academic CV that our AI will not only read but truly understand and elevate.
                    </p>

                    {/* Rule 1 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-800 font-bold text-lg">1</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Use a Clean, Standard Format</h3>
                                <p className="text-gray-700 mb-4">
                                    While visually complex layouts might seem appealing, they can often confuse automated text extraction tools.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-900 mb-2">✅ Do</h4>
                                        <p className="text-green-800 text-sm">Opt for a clean, single-column, traditional format. Think clarity and readability.</p>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-red-900 mb-2">❌ Avoid</h4>
                                        <p className="text-red-800 text-sm">Using multiple columns, intricate tables, excessive graphic elements, or placing crucial text within image boxes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rule 2 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-800 font-bold text-lg">2</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Employ Clear, Standard Headings</h3>
                                <p className="text-gray-700 mb-4">
                                    Our AI actively looks for common academic headings to accurately categorize your valuable information. Using them ensures your profile is meticulously organized.
                                </p>
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-3">We highly recommend including distinct headings for:</h4>
                                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                                        <ul className="space-y-1 text-blue-800">
                                            <li>• Education</li>
                                            <li>• Research Experience</li>
                                            <li>• Publications</li>
                                        </ul>
                                        <ul className="space-y-1 text-blue-800">
                                            <li>• Awards and Grants</li>
                                            <li>• Skills</li>
                                            <li>• Research Interests / Areas of Expertise</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rule 3 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-800 font-bold text-lg">3</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Be Specific with Your Research Interests</h3>
                                <p className="text-gray-700 mb-4">
                                    This is arguably the most critical section for our semantic matching and AI insight features. Precision here directly impacts who you get connected with!
                                </p>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-purple-900 mb-2">Good Example:</h4>
                                    <p className="text-purple-800 text-sm italic mb-3">
                                        Instead of a broad "AI," list specific domains like "Natural Language Processing for Malay Linguistics," "Computer Vision for Medical Imaging," or "Deep Learning Architectures for Financial Forecasting."
                                    </p>
                                    <div className="bg-purple-100 rounded-lg p-3">
                                        <p className="text-purple-900 text-xs">
                                            <strong>💡 Pro Tip:</strong> Remember, our platform organizes research into a sophisticated three-tier system (Field &gt; Area &gt; Niche Domain). Using specific, well-defined terms in your CV helps the AI accurately map your expertise to our structured system, ensuring perfect matches for supervisors, grants, and collaborators.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rule 4 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-orange-800 font-bold text-lg">4</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">File Format Matters for Precision</h3>
                                <p className="text-gray-700 mb-4">
                                    We support a range of formats including PDF, DOCX, DOC, and various image formats.
                                </p>
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-orange-900 mb-2">For the highest accuracy and to bypass the OCR step:</h4>
                                    <p className="text-orange-800 text-sm">
                                        We strongly recommend uploading a text-based PDF. This allows for direct, flawless text extraction, giving our AI the clearest data to work with.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Role-Specific Checklist */}
                <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        Role-Specific Checklist: Tailor Your CV for Maximum Impact
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Our AI intelligently looks for different, high-priority information based on your declared role. Before you upload, do a quick check to make sure these key sections are clear and detailed.
                    </p>

                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Academicians */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-blue-600" />
                                For Academicians
                            </h3>
                            <ul className="space-y-3 text-gray-700 text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Publications list clearly formatted with titles, authors, and journal/conference details</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Grants Awarded (e.g., FRGS, TRGS) and Supervisory Experience listed under distinct headings</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Current Position (e.g., Senior Lecturer, Associate Professor) and Department clearly stated</span>
                                </li>
                            </ul>
                        </div>

                        {/* Postgraduate Students */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                For Postgraduate Students
                            </h3>
                            <ul className="space-y-3 text-gray-700 text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Current Degree (e.g., PhD in Environmental Science, MSc in Robotics Engineering) clearly listed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Thesis/Dissertation Title and primary Research Area detailed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Technical and lab Skills (e.g., Python, MATLAB, ELISA, SEM) easy to find and well-defined</span>
                                </li>
                            </ul>
                        </div>

                        {/* Undergraduate Students */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-purple-600" />
                                For Undergraduate Students
                            </h3>
                            <ul className="space-y-3 text-gray-700 text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Relevant Coursework, Academic Projects (like Final Year Project), or internships highlighted</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Research Preference or intended area of study clearly articulated</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 sm:p-6 lg:p-8 text-white text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 leading-tight">
                        Ready to Transform Your CV into a Dynamic Nexscholar Profile?
                    </h2>
                    <p className="text-blue-100 mb-6 leading-relaxed">
                        Now that you have the blueprint for an AI-friendly CV, you're ready to create your powerful Nexscholar profile in a fraction of the time. Get ready to connect with your next supervisor, secure that grant, or find your ideal research collaborator!
                    </p>
                    <a
                        href="/role"
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                    >
                        <Upload className="w-5 h-5" />
                        Head to your profile settings
                    </a>
                    <p className="text-blue-200 text-sm mt-4">
                        Upload your optimized CV, and watch our AI get to work building your professional presence!
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CraftingAcademicCV;
