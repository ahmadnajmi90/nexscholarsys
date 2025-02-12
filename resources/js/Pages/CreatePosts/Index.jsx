import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import useRoles from '../../Hooks/useRoles';

const Index = () => {
    const { createPosts, search } = usePage().props;
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
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
        <MainLayout title="">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Your Posts</h1>
                <Link
                    href={route('create-posts.create')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add New Post
                </Link>
            </div>

            {/* Search bar */}
            <div className="mb-4">
                <form id="search-form" method="GET" action={route('create-posts.index')}>
                    <input
                        type="text"
                        name="search"
                        value={searchTerm}
                        onChange={handleSearchChange} // Handle the input change with debounce
                        placeholder="Search post..."
                        className="border rounded-lg px-4 py-2 w-full"
                    />
                </form>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Title</th>
                            <th className="py-2 px-4 border-b">Category</th>
                            <th className="py-2 px-4 border-b">Tags</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {createPosts.data.map(post => (
                            <tr key={post.id} className="border-b">
                                <td className="py-2 px-4 font-semibold text-center">{post.title}</td>
                                <td className="py-2 px-4 text-center">{post.category}</td>
                                <td className="py-2 px-4 text-center">
                                    {post.tags && Array.isArray(post.tags)
                                        ? post.tags.join(", ")
                                        : post.tags}
                                </td>
                                <td className="py-2 px-4 text-center">
                                    <Link
                                        href={route('create-posts.edit', post.id)}
                                        className="text-blue-500 hover:underline mr-2"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('create-posts.destroy', post.id)}
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
                {createPosts.links.map((link, index) => (
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
