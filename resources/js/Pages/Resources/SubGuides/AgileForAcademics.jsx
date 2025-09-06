import React from 'react';
import { Zap, Target, Users, Clock, RefreshCw, Settings, CheckSquare, BarChart3 } from 'lucide-react';

const AgileForAcademics = () => {
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    Agile for Academics: Managing Your PhD Using the ScholarLab's Kanban Board
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    A PhD is not a single project; it's a multi-year marathon composed of countless smaller sprints. It involves coursework, extensive reading, experiments, data analysis, writing, and publishing—all happening at once. It's easy to feel overwhelmed and lose sight of your progress.
                </p>
                <p className="text-gray-700 mt-4">
                    What if you could borrow a proven strategy from the world of software development to bring clarity, focus, and a sense of momentum to your research? Welcome to Agile for Academics. This guide will introduce you to the basics of the Agile methodology and show you how to implement it using the intuitive Kanban Board in your Nexscholar ScholarLab.
                </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {/* What is Agile */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">What is Agile? (And Why Should a PhD Student Care?)</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        "Agile" is a project management philosophy that's all about breaking down large, complex projects into smaller, manageable chunks of work. Instead of planning everything years in advance, you work in short, focused cycles (often called "sprints"), constantly adapting and making clear, visible progress.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        The Kanban board is one of the simplest and most powerful tools for putting Agile into practice. It's a visual way to manage your workflow, see what you're working on, and track tasks from "To Do" to "Done."
                    </p>
                    <div className="bg-blue-100 rounded-lg p-4">
                        <p className="text-blue-800 text-sm mb-3">
                            <strong>💡 The benefits for a PhD student are immense:</strong>
                        </p>
                        <ul className="text-blue-700 text-sm space-y-2">
                            <li>• <strong>Reduces Overwhelm:</strong> Instead of staring at the mountain of "write thesis," you focus on the small, achievable step in front of you.</li>
                            <li>• <strong>Visualizes Progress:</strong> Seeing tasks move from left to right provides a powerful psychological boost and a clear record of your accomplishments.</li>
                            <li>• <strong>Improves Focus:</strong> It helps you limit your "work-in-progress," preventing you from juggling too many tasks at once.</li>
                        </ul>
                    </div>
                </section>

                {/* Setting Up Your Board */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        Setting Up Your PhD Kanban Board in the ScholarLab
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Let's get practical. Here's how to create your personal PhD command center in just a few minutes.
                    </p>

                    {/* Image Placeholder */}
                    <div className="bg-gray-100 rounded-lg p-4 sm:p-6 lg:p-8 text-center mb-4 sm:mb-6 lg:mb-8">
                        <img
                            src="/images/resources/3.2.1.png"
                            alt="PhD Kanban Board Setup"
                            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <div className="hidden text-gray-500 italic">
                            [PhD Kanban Board Setup Image]
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
                                        In your ScholarLab, create a new Board and give it a name like "My PhD Journey" or "Thesis Command Center."
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
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Set Up Your Workflow Lists</h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        A Kanban board is all about the columns (we call them "Lists" in the ScholarLab). We recommend starting with a simple, powerful five-list setup for your PhD:
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <ul className="space-y-2 text-gray-700 font-medium">
                                            <li>• Thesis Backlog</li>
                                            <li>• This Semester's Goals</li>
                                            <li>• This Month's Focus</li>
                                            <li>• In Progress</li>
                                            <li>• Done</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Populating Your Board */}
                <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <CheckSquare className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Populating Your Board: From Thesis to Tasks</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Now, let's break down that mountain into pebbles.
                    </p>

                    {/* Image Placeholder */}
                    <div className="bg-gray-100 rounded-lg p-4 sm:p-6 lg:p-8 text-center mb-4 sm:mb-6 lg:mb-8">
                        <img
                            src="/images/resources/3.2.2.png"
                            alt="Populating Kanban Board"
                            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <div className="hidden text-gray-500 italic">
                            [Populating Kanban Board Image]
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* List 1 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                1. The Thesis Backlog List
                            </h3>
                            <p className="text-gray-700 mb-3">
                                This is your master list. Brainstorm every single thing you need to do to complete your PhD, from start to finish. Don't worry about order yet. Just get it all out. This is a "brain dump" list.
                            </p>
                            <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-blue-800 text-sm font-medium">Examples:</p>
                                <ul className="text-blue-700 text-sm mt-1 space-y-1">
                                    <li>• "Complete coursework"</li>
                                    <li>• "Pass qualifying exams"</li>
                                    <li>• "Write Chapter 1: Introduction"</li>
                                    <li>• "Run statistical analysis on Dataset X"</li>
                                    <li>• "Submit paper to Journal Y"</li>
                                    <li>• "Prepare for thesis defense"</li>
                                </ul>
                            </div>
                        </div>

                        {/* List 2 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Target className="w-5 h-5 text-green-600" />
                                2. The This Semester's Goals List
                            </h3>
                            <p className="text-gray-700 mb-3">
                                At the beginning of each semester, review your Thesis Backlog and pull the high-level goals you want to achieve over the next 3-4 months into this list.
                            </p>
                            <div className="bg-green-50 rounded-lg p-3">
                                <p className="text-green-800 text-sm font-medium">Examples:</p>
                                <ul className="text-green-700 text-sm mt-1 space-y-1">
                                    <li>• "Finalize Literature Review"</li>
                                    <li>• "Complete all lab experiments for Aim 1"</li>
                                    <li>• "Draft Chapter 2"</li>
                                </ul>
                            </div>
                        </div>

                        {/* List 3 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-600" />
                                3. The This Month's Focus List
                            </h3>
                            <p className="text-gray-700 mb-3">
                                At the start of each month, look at your semester goals and break them down further. Pull the tasks you'll focus on this month into this list.
                            </p>
                            <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-purple-800 text-sm font-medium">Examples:</p>
                                <ul className="text-purple-700 text-sm mt-1 space-y-1">
                                    <li>• "Read and summarize 15 key papers"</li>
                                    <li>• "Calibrate the new microscope"</li>
                                    <li>• "Write the first draft of the Methodology section"</li>
                                </ul>
                            </div>
                        </div>

                        {/* List 4 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-600" />
                                4. The In Progress List
                            </h3>
                            <p className="text-gray-700 mb-3">
                                This is the most important list for your day-to-day focus. Limit this list to just 1-3 tasks at a time. When you are actively working on something, move the card here. This prevents multitasking and keeps you focused.
                            </p>
                            <div className="bg-orange-50 rounded-lg p-3">
                                <p className="text-orange-800 text-sm font-medium">Example:</p>
                                <p className="text-orange-700 text-sm mt-1">"Analyze results from Experiment A."</p>
                            </div>
                        </div>

                        {/* List 5 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-red-600" />
                                5. The Done List
                            </h3>
                            <p className="text-gray-700 mb-3">
                                The best list of all! When a task is complete, drag it here. This list becomes your running record of accomplishments. Feeling unproductive? Just look at your Done list to see how far you've come.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pro-Tips */}
                <section className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-6 h-6 text-amber-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Pro-Tips for Your Academic Sprints</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Use the Calendar View</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Add due dates to your major goals in the This Semester's Goals list. Then, switch to the Calendar View to see your key deadlines at a glance.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Collaborate with Your Supervisor</h3>
                            <p className="text-gray-700 leading-relaxed">
                                If your supervisor is also on Nexscholar, invite them to your board. They can see your progress, leave comments on tasks, and help you prioritize your goals.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Create Recurring Tasks</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Have a weekly lab meeting or a bi-weekly report to write? Create a recurring task to make sure you never forget.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 sm:p-6 lg:p-8 text-white text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 leading-tight">Stop Drowning, Start Doing</h2>
                    <p className="text-green-100 mb-6 leading-relaxed">
                        Your PhD is a journey, not a single, monolithic task. By adopting an agile mindset and using the ScholarLab's Kanban board, you can transform a source of anxiety into a manageable, motivating, and even enjoyable process.
                    </p>
                    <p className="text-green-200 mb-6">
                        Set up your board today and take the first step towards a more organized and productive research journey.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AgileForAcademics;
