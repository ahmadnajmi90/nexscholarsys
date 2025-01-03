import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';

const RolesList = ({ roles, abilities }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, delete: destroy, processing } = useForm({
        name: '',
        title: '',
    });

    const handleCreateAbility = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('abilities.store'), {
            data,
            onSuccess: () => {
                setIsModalOpen(false); // Close modal after success
                alert('Ability created successfully!');
            },
            onError: (errors) => {
                console.log('errors', errors);
            },
        });
    };

    return (
        <MainLayout title="Assign Abilities">
            <div className="p-2 bg-white mb-8">
                <table className="w-full border-black">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="border p-4 text-left">Role</th>
                            <th className="border p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td className="border p-4">{role.title}</td>
                                <td className="border p-4 text-center">
                                    <Link
                                        href={route('roles.abilities.edit', { role: role.id })}
                                        className="bg-black text-white px-4 py-2 rounded"
                                    >
                                        Assign Abilities
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-2 bg-white">
                {/* Ability List */}
                <table className="w-full border-black mb-4">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="border p-4 text-left">Ability Name</th>
                            <th className="border p-4 text-left">Ability Title</th>
                            <th className="border p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {abilities.map((ability) => (
                            <tr key={ability.id}>
                                <td className="border p-4">{ability.name}</td>
                                <td className="border p-4">
                                    {ability.title}
                                </td>
                                <td className="border p-4 text-center">
                                    <Link
                                        href={route('abilities.destroy', ability.id)}
                                        method="delete"
                                        as="button"
                                        className="text-red-500 hover:underline"
                                        onClick={(e) => {
                                            if (!confirm('Are you sure you want to delete this ability?')) {
                                                e.preventDefault();
                                            }
                                        }}
                                        >
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Button to Open Modal */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    + Create Ability
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Create Ability</h2>
                        <form onSubmit={handleCreateAbility}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ability Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Ability Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {processing ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default RolesList;
