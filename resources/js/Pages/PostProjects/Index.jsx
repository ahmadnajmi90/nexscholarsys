import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const Index = () => {
    const { postProjects } = usePage().props;

    return (
        <MainLayout title="Your Projects">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Your Projects</h1>
                <Link
                    href={route('post-projects.create')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add New Project
                </Link>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Title</th>
                            <th className="py-2 px-4 border-b">Project Type</th>
                            <th className="py-2 px-4 border-b">Purpose</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">Start Date</th>
                            <th className="py-2 px-4 border-b">End Date</th>
                            <th className="py-2 px-4 border-b">Budget</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postProjects?.map(project => (
                            <tr key={project.id} className="border-b">
                                <td className="py-2 px-4 font-semibold text-center">{project.title}</td>
                                <td className="py-2 px-4 text-center">{project.project_type}</td>
                                <td className="py-2 px-4 text-center">{project.purpose}</td>
                                <td className="py-2 px-4 text-center">{project.location}</td>
                                <td className="py-2 px-4 text-center">{project.start_date}</td>
                                <td className="py-2 px-4 text-center">{project.end_date}</td>
                                <td className="py-2 px-4 text-center">{project.budget}</td>
                                <td className="py-2 px-4 text-center">
                                    <Link
                                        href={route('post-projects.edit', project.id)}
                                        className="text-blue-500 hover:underline mr-2"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('post-projects.destroy', project.id)}
                                        method="delete"
                                        as="button"
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default Index;
