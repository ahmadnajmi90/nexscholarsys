import React from 'react';
import { Eye, List, Kanban, Calendar, BarChart3, Users, Table, Clock, Target } from 'lucide-react';

const ChoosingYourView = () => {
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    Choosing Your View: When to Use a Board, List, Table, Calendar, or Timeline for Your Research Project
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Different stages of research require different perspectives. Sometimes you need to see the big picture of your entire PhD timeline, and other times you just need a simple to-do list for the day. A single, rigid view can't effectively manage this dynamic process.
                </p>
                <p className="text-gray-700 mt-4">
                    That's why the Nexscholar NexLab is built with five distinct, powerful views. Think of it as a toolkit that gives you the right lens for any task at hand.
                </p>
                <p className="text-gray-700 mt-2">
                    This guide, crafted by our team here in Johor Bahru, will walk you through each of the five views, explaining what they're best for and how you can use them to make your research management more efficient and intuitive.
                </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {/* 1. Board View */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Kanban className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">1. The Board View (Kanban): For Visualizing Your Workflow</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        The Kanban board is your visual command center, perfect for tracking the progress of tasks as they move through different stages of your workflow.
                    </p>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Best For:</h3>
                        <p className="text-gray-700 mb-4">Visual project management and tracking the progression of tasks from "To Do" to "Done".</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Use it when:</h3>
                        <p className="text-gray-700 mb-4">You want to see the flow of your work, such as moving a research paper through stages like Outline → First Draft → Supervisor Review → Submitted. The drag-and-drop interface provides a satisfying sense of accomplishment.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>• Drag-and-drop tasks between lists</li>
                            <li>• Visual task cards with key information</li>
                            <li>• Real-time updates for team collaboration</li>
                        </ul>
                    </div>
                </section>

                {/* 2. List View */}
                <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <List className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">2. The List View: For a Quick Daily Overview</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        The List view offers a clean, compact, and straightforward overview of your tasks, organized by their respective lists.
                    </p>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Best For:</h3>
                        <p className="text-gray-700 mb-4">Quick task reviews and daily status updates.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Use it when:</h3>
                        <p className="text-gray-700 mb-4">You start your day and just need a simple, scannable "to-do list" to see what's on your plate. It's perfect for quickly checking off completed items and seeing what's next.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>• Checkbox for quick task completion</li>
                            <li>• Clear priority indicators and assignee avatars</li>
                            <li>• Option to show or hide completed tasks to reduce clutter</li>
                        </ul>
                    </div>
                </section>

                {/* 3. Table View */}
                <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Table className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">3. The Table View: For Detailed Analysis & Reporting</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        The Table view transforms your project into a powerful, sortable database. This view is all about details, data, and managing a large volume of tasks.
                    </p>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Best For:</h3>
                        <p className="text-gray-700 mb-4">Data analysis, creating reports, and managing large numbers of tasks at once.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Use it when:</h3>
                        <p className="text-gray-700 mb-4">You need to prepare a progress report for a grant, get a detailed overview of your entire project's tasks, or when a supervisor needs to manage the tasks of multiple students.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>• Sortable columns, global search, and advanced filtering</li>
                            <li>• Pagination for efficiently managing long lists of tasks</li>
                        </ul>
                    </div>
                </section>

                {/* 4. Calendar View */}
                <section className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">4. The Calendar View: For Managing Deadlines</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        The Calendar view gives you a clear, date-based perspective of your project, helping you manage your time and never miss a critical deadline.
                    </p>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Best For:</h3>
                        <p className="text-gray-700 mb-4">Deadline tracking and schedule coordination.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Use it when:</h3>
                        <p className="text-gray-700 mb-4">You're juggling multiple deadlines, like a conference submission, a grant application, and a chapter draft. It helps you visualize your schedule and identify potential conflicts.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>• Monthly and weekly views of your tasks</li>
                            <li>• Clear visualization of all task due dates</li>
                            <li>• Priority-based color coding to highlight urgent tasks</li>
                        </ul>
                    </div>
                </section>

                {/* 5. Timeline View */}
                <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-6 h-6 text-teal-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">5. The Timeline View (Gantt Chart): For Long-Term Planning</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        The Timeline view provides a high-level, Gantt chart-style overview of your entire project, showing how tasks and phases connect over time.
                    </p>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Best For:</h3>
                        <p className="text-gray-700 mb-4">Long-term project planning and visualizing your entire research timeline.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Use it when:</h3>
                        <p className="text-gray-700 mb-4">You are at the beginning of your PhD or a year-long research project and need to map out the major phases, from literature review to final submission.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>• Interactive Gantt charts to visualize task durations</li>
                            <li>• Clear overview of project phasing and potential dependencies</li>
                        </ul>
                    </div>
                </section>

                {/* Summary Table */}
                <section className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-6 h-6 text-gray-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Summary: Your View Toolkit</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        View
                                    </th>
                                    <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Primary Goal
                                    </th>
                                    <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Best For
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-200 px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                                        Board
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        See Workflow
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        Visualizing progress through stages
                                    </td>
                                </tr>
                                <tr className="bg-gray-25">
                                    <td className="border border-gray-200 px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                                        List
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        See Tasks
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        Quick daily check-ins and to-do lists
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-200 px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                                        Table
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        See Details
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        In-depth analysis and reporting
                                    </td>
                                </tr>
                                <tr className="bg-gray-25">
                                    <td className="border border-gray-200 px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                                        Calendar
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        See Deadlines
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        Managing submission and grant dates
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-200 px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                                        Timeline
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        See the Big Picture
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-gray-700">
                                        Long-term project and PhD planning
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 sm:p-6 lg:p-8 text-white text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 leading-tight">Master Your Research Management</h2>
                    <p className="text-blue-100 mb-6 leading-relaxed">
                        The true power of NexLab lies in its flexibility. Don't stick to just one view. Open your project board today and try switching between the different views to gain a new, powerful perspective on your research.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ChoosingYourView;
