import React from 'react';
import { FileText, Target, List, BarChart3, Users, CheckCircle, Clock, Settings, CheckSquare, Zap } from 'lucide-react';

const PaperWritingTemplate = () => {
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    The Ultimate Paper Writing Project Template (For the Nexscholar ScholarLab)
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Managing the journey of a research paper—from a fleeting idea to a final, published manuscript—can feel chaotic. Scattered notes, endless email chains, and missed deadlines are all too common for researchers here in Johor Bahru and around the world.
                </p>
                <p className="text-gray-700 mt-4">
                    What if you could manage the entire process in one clean, visual, and collaborative space? Welcome to the Ultimate Paper Writing Project Template, a pre-built workflow designed specifically for the Nexscholar ScholarLab. This guide will show you exactly how to set up this template in your own workspace, leveraging our specialized academic features to bring structure, clarity, and efficiency to your research.
                </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {/* What You'll Get */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">What You'll Get</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        By following this guide, you'll create a powerful Kanban board that visualizes every stage of your paper writing process. This template will help you:
                    </p>
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-2">📊 Track Progress</h3>
                            <p className="text-gray-700 text-sm">From ideation to publication with visual progress tracking.</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-2">⏰ Manage Deadlines</h3>
                            <p className="text-gray-700 text-sm">Collaborate with co-authors seamlessly and meet deadlines.</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-2">🎯 Academic Features</h3>
                            <p className="text-gray-700 text-sm">Utilize specialized features built just for academic writing.</p>
                        </div>
                    </div>
                </section>

                {/* Setting Up Your Board */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        Setting Up Your Board: A 5-Minute Guide
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Let's build your new research command center.
                    </p>

                    {/* Image Placeholder */}
                    <div className="bg-gray-100 rounded-lg p-4 sm:p-6 lg:p-8 text-center mb-4 sm:mb-6 lg:mb-8">
                        <img
                            src="/images/resources/3.1.1.png"
                            alt="Paper Writing Template Setup"
                            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <div className="hidden text-gray-500 italic">
                            [Paper Writing Template Setup Image]
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-800 font-bold text-lg">1</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Create a New Board</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        In your ScholarLab, navigate to the appropriate Workspace and create a new Board. We suggest naming it after your paper, for example: "Paper: The Impact of AI on Malaysian SMEs."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-800 font-bold text-lg">2</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Create These 6 Lists</h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Now, create the following six lists. These represent the key stages of a typical research paper lifecycle. Simply click "Add List" and type in each name:
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <ul className="space-y-2 text-gray-700 font-medium">
                                            <li>• Research & Ideation</li>
                                            <li>• Data Collection & Analysis</li>
                                            <li>• Outline & First Draft</li>
                                            <li>• Revisions & Feedback</li>
                                            <li>• Submission</li>
                                            <li>• Post-Submission</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Template Workflow */}
                <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <List className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">The Template Workflow: Lists and Tasks Explained</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Here's how to use each list to manage your project effectively.
                    </p>

                    <div className="space-y-6">
                        {/* List 1 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckSquare className="w-5 h-5 text-blue-600" />
                                List 1: Research & Ideation
                            </h3>
                            <p className="text-gray-700 mb-3">
                                This is where your project begins. Use this list for brainstorming, literature reviews, and refining your research question.
                            </p>
                            <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-blue-800 text-sm font-medium">Example Tasks:</p>
                                <ul className="text-blue-700 text-sm mt-1 space-y-1">
                                    <li>• "Conduct initial keyword search for literature"</li>
                                    <li>• "Identify 20 core papers for lit review"</li>
                                    <li>• "Finalize research hypothesis"</li>
                                </ul>
                            </div>
                        </div>

                        {/* List 2 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-green-600" />
                                List 2: Data Collection & Analysis
                            </h3>
                            <p className="text-gray-700 mb-3">
                                This list is for the hands-on part of your research. Track your experiments, surveys, or data analysis tasks here.
                            </p>
                            <div className="bg-green-50 rounded-lg p-3">
                                <p className="text-green-800 text-sm font-medium">Example Tasks:</p>
                                <ul className="text-green-700 text-sm mt-1 space-y-1">
                                    <li>• "Run Experiment A on the dataset"</li>
                                    <li>• "Analyze survey results with SPSS"</li>
                                    <li>• "Transcribe interviews with subjects"</li>
                                </ul>
                            </div>
                        </div>

                        {/* List 3 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-600" />
                                List 3: Outline & First Draft
                            </h3>
                            <p className="text-gray-700 mb-3">
                                Now it's time to start writing. This list is for structuring your paper and getting the first version down.
                            </p>
                            <div className="bg-purple-50 rounded-lg p-4 mb-3">
                                <h4 className="font-semibold text-purple-900 mb-2">Key Task: Create a "Paper Writing Task"</h4>
                                <p className="text-purple-800 text-sm">
                                    In this list, create your main task for the manuscript itself. When you create it, select the specialized "Paper Writing Task" type. Name it after your paper title. This central task will hold all the key academic metadata for your project.
                                </p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-purple-800 text-sm font-medium">Example Sub-Tasks:</p>
                                <ul className="text-purple-700 text-sm mt-1 space-y-1">
                                    <li>• "Write Introduction & Lit Review"</li>
                                    <li>• "Draft Methodology Section"</li>
                                    <li>• "Create initial figures and tables"</li>
                                </ul>
                            </div>
                        </div>

                        {/* List 4 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-600" />
                                List 4: Revisions & Feedback
                            </h3>
                            <p className="text-gray-700 mb-3">
                                Writing is an iterative process. Use this list to track feedback loops and revisions.
                            </p>
                            <div className="bg-orange-50 rounded-lg p-3">
                                <p className="text-orange-800 text-sm font-medium">Example Tasks:</p>
                                <ul className="text-orange-700 text-sm mt-1 space-y-1">
                                    <li>• "Send v1 draft to Supervisor for feedback"</li>
                                    <li>• "Incorporate Dr. Lee's comments into Methodology"</li>
                                    <li>• "Run manuscript through grammar checker"</li>
                                </ul>
                            </div>
                        </div>

                        {/* List 5 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-red-600" />
                                List 5: Submission
                            </h3>
                            <p className="text-gray-700 mb-3">
                                You're almost there! This list is for the final, meticulous steps before you submit.
                            </p>
                            <div className="bg-red-50 rounded-lg p-3">
                                <p className="text-red-800 text-sm font-medium">Example Tasks:</p>
                                <ul className="text-red-700 text-sm mt-1 space-y-1">
                                    <li>• "Format manuscript and references for [Target Journal Name]"</li>
                                    <li>• "Write cover letter to the editor"</li>
                                    <li>• "Complete journal submission form"</li>
                                </ul>
                            </div>
                        </div>

                        {/* List 6 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                List 6: Post-Submission
                            </h3>
                            <p className="text-gray-700 mb-3">
                                The work isn't over once you click "submit." Use this list to track what happens next.
                            </p>
                            <div className="bg-indigo-50 rounded-lg p-3">
                                <p className="text-indigo-800 text-sm font-medium">Example Tasks:</p>
                                <ul className="text-indigo-700 text-sm mt-1 space-y-1">
                                    <li>• "Log submission date"</li>
                                    <li>• "Address reviewer comments for revision"</li>
                                    <li>• "Update profile with 'Published' status"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pro-Tips */}
                <section className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-6 h-6 text-amber-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Pro-Tips for Using Your Template</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Leverage Paper Writing Task Fields</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Click on your main "Paper Writing Task" and fill out the specialized academic fields. Add your target Publication Type, Scopus Information, and attach the latest PDF draft to keep everything in one place.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Use the Timeline View</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Once you've added due dates to your tasks, switch to the Timeline View to get a Gantt chart of your entire project. This is perfect for long-term planning and visualizing your deadlines.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Collaborate Effectively</h3>
                            <p className="text-gray-700 leading-relaxed">
                                If you're co-authoring, invite your collaborators to the board and assign tasks to them. Use the comments section within each task to discuss specific points and keep conversations organized.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 sm:p-6 lg:p-8 text-white text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 leading-tight">Start Writing Today!</h2>
                    <p className="text-green-100 mb-6 leading-relaxed">
                        Stop managing your research in scattered documents and endless email threads. Set up your Ultimate Paper Writing Template in the ScholarLab today and bring clarity, focus, and powerful collaboration to your next publication.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PaperWritingTemplate;
