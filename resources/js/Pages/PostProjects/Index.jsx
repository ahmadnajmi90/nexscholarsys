import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const Index = () => {
    const { postProjects, isPostgraduate, search  } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(search || ''); // Store the search term locally

    let debounceTimeout;

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Clear the previous debounce timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new debounce timeout to delay form submission
        debounceTimeout = setTimeout(() => {
            const form = document.getElementById('search-form');
            form.submit(); // Automatically submit the form
        }, 300); // Adjust delay (300ms) as needed
    };

    return (
        <MainLayout title="" isPostgraduate={isPostgraduate}>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Your Projects</h1>
                <Link
                    href={route('post-projects.create')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add New Project
                </Link>
            </div>

            {/* Search bar */}
            <div className="mb-4">
                <form id="search-form" method="GET" action={route('post-projects.index')}>
                    <input
                        type="text"
                        name="search"
                        value={searchTerm}
                        onChange={handleSearchChange} // Handle the input change with debounce
                        placeholder="Search projects..."
                        className="border rounded-lg px-4 py-2 w-full"
                    />
                </form>
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
                        {postProjects?.data.map(project => (
                            <tr key={project.id} className="border-b">
                                <td className="py-2 px-4 font-semibold text-center">{project.title}</td>
                                <td className="py-2 px-4 text-center">{project.project_type}</td>
                                <td className="py-2 px-4 text-center">
                                    {project.purpose === "find_accollaboration" && "Find Academician Collaboration"}
                                    {project.purpose === "find_incollaboration" && "Find Industry Collaboration"}
                                    {project.purpose === "find_sponsorship" && "Find Sponsorship"}
                                </td>
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

            {/* Pagination Links */}
            <div className="mt-4 flex justify-center">
                {postProjects.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url}
                        className={`mx-1 px-4 py-2 rounded ${
                            link.active
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </MainLayout>
    );
};

export default Index;
