import React from 'react';
import { usePage, useForm } from '@inertiajs/react';
import MainLayout from "../../Layouts/MainLayout";
import useRoles from '@/Hooks/useRoles';

const AcademiciansList = () => {
    const { academicians, flash, universities, faculties } = usePage().props; // Get data passed from the backend
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    const { post } = useForm(); // For handling verification requests

    const handleVerify = (id) => {
        post(route('faculty-admin.verify-academician', id), {
            onSuccess: () => {
                alert('Academician verified successfully!');
            },
            onError: () => {
                alert('Failed to verify academician.');
            },
        });
    };
    
    const getUniversityNameById = (id) => {
        const university = universities.find((u) => u.id === id); // Find the university by ID
        return university ? university.full_name : "Unknown University"; // Return the full_name or a default string
    };

    const getFacultyNameById = (id) => {
        const faculty = faculties.find((u) => u.id === id); // Find the university by ID
        return faculty ? faculty.name : "Unknown University"; // Return the full_name or a default string
    };

    return (
        <MainLayout title="">
            <div className="px-4 pb-4">
                <h1 className="text-2xl font-bold mb-4">Verify Academicians</h1>
                {flash?.success && (
                    <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
                        {flash.success}
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">University</th>
                                <th className="border border-gray-300 px-4 py-2">Faculty</th>
                                <th className="border border-gray-300 px-4 py-2">Department</th>
                                <th className="border border-gray-300 px-4 py-2">Current Position</th>
                                <th className="border border-gray-300 px-4 py-2">Verified Status</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {academicians.map((academician) => (
                                <tr key={academician.id}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {academician.full_name || 'N/A'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {academician.user?.email || 'N/A'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {getUniversityNameById(academician.university)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {getFacultyNameById(academician.faculty)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {academician.department || 'N/A'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {academician.current_position || 'N/A'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-red-500 font-bold">
                                        {academician.verified === 0 ? 'Not Verified' : 'Verified'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            className="bg-black text-white px-4 py-2 rounded"
                                            onClick={() => handleVerify(academician.id)}
                                        >
                                            Verify
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
};

export default AcademiciansList;
