import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const Index = () => {
    const { postGrants } = usePage().props;

    return (
        <MainLayout title="Your Grants">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Your Grants</h1>
                <Link
                    href={route('post-grants.create')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add New Grant
                </Link>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Title</th>
                            <th className="py-2 px-4 border-b">Post Status</th>
                            <th className="py-2 px-4 border-b">Grant Status</th>
                            <th className="py-2 px-4 border-b">Category</th>
                            <th className="py-2 px-4 border-b">Sponsored By</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">Start Date</th>
                            <th className="py-2 px-4 border-b">End Date</th>
                            <th className="py-2 px-4 border-b">Budget</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postGrants.map(grant => (
                            <tr key={grant.id} className="border-b">
                                <td className="py-2 px-4 font-semibold text-center">{grant.title}</td>
                                <td className="py-2 px-4 text-center">{grant.post_status}</td>
                                <td className="py-2 px-4 text-center">{grant.grant_status}</td>
                                <td className="py-2 px-4 text-center">{grant.category}</td>
                                <td className="py-2 px-4 text-center">{grant.sponsored_by}</td>
                                <td className="py-2 px-4 text-center">{grant.location}</td>
                                <td className="py-2 px-4 text-center">{grant.start_date}</td>
                                <td className="py-2 px-4 text-center">{grant.end_date}</td>
                                <td className="py-2 px-4 text-center">{grant.budget}</td>
                                <td className="py-2 px-4 text-center">
                                    <Link
                                        href={route('post-grants.edit', grant.id)}
                                        className="text-blue-500 hover:underline mr-2"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('post-grants.destroy', grant.id)}
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
