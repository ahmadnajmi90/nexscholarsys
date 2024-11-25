import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const Index = () => {
    const { postEvents, isPostgraduate } = usePage().props;

    return (
        <MainLayout title="Your Events" isPostgraduate={isPostgraduate}>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Your Events</h1>
                <Link
                    href={route('post-events.create')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add New Event
                </Link>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Event Name</th>
                            <th className="py-2 px-4 border-b">Event Type</th>
                            <th className="py-2 px-4 border-b">Theme</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">Start Date</th>
                            <th className="py-2 px-4 border-b">End Date</th>
                            <th className="py-2 px-4 border-b">Organized By</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postEvents.map(event => (
                            <tr key={event.id} className="border-b">
                                <td className="py-2 px-4 font-semibold text-center">{event.event_name}</td>
                                <td className="py-2 px-4 text-center">{event.event_type}</td>
                                <td className="py-2 px-4 text-center">
                                    {event.theme ? JSON.parse(event.theme).join(', ') : 'N/A'}
                                </td>
                                <td className="py-2 px-4 text-center">{event.location}</td>
                                <td className="py-2 px-4 text-center">{event.start_date_time}</td>
                                <td className="py-2 px-4 text-center">{event.end_date_time}</td>
                                <td className="py-2 px-4 text-center">{event.organized_by}</td>
                                <td className="py-2 px-4 text-center">
                                    <Link
                                        href={route('post-events.edit', event.id)}
                                        className="text-blue-500 hover:underline mr-2"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('post-events.destroy', event.id)}
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
