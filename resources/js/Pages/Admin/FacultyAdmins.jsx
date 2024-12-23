import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

const FacultyAdminRegistration = ({ universities, faculties }) => {
    const { data, setData, post, errors } = useForm({
        email: "",
        worker_id: "",
        university: "",
        faculty: "",
    });

    // State to hold the filtered faculties
    const [selectedUniversity, setSelectedUniversity] = useState(data.university);
    const filteredFaculties = faculties.filter(
        (faculty) => faculty.university_id === parseInt(selectedUniversity)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('faculty-admins.store'), {
            onSuccess: () => {
                alert("Create faculty admin successfully.");
              },
              onError: (errors) => {
                  console.error("Error create faculty admin:", errors);
                  alert("Failed to create faculty admin. Please try again.");
              },
        });
    };

    return (
        <MainLayout title="">
            <div className="px-2 bg-white">
                <h1 className="text-2xl font-bold mb-4">Create Faculty Admin</h1>
                <form onSubmit={handleSubmit}>
                    <div className='mt-4'>
                        <InputLabel htmlFor="email" value="Email"/>
                        <TextInput
                            id="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="email"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className='mt-4'>
                        <InputLabel htmlFor="worker_id" value="Worker ID"/>
                        <TextInput
                            id="worker_id"
                            name="worker_id"
                            value={data.worker_id}
                            className="mt-1 block w-full"
                            autoComplete="worker_id"
                            isFocused={true}
                            onChange={(e) => setData('worker_id', e.target.value)}
                            required
                        />
                        <InputError message={errors.worker_id} className="mt-2" />
                    </div>

                    {/* University */}
                    <div className='mt-4'>
                        <InputLabel htmlFor="university" value="University" required />
                        <select
                            id="university"
                            className="mt-1 block w-full border rounded-md p-2"
                            value={selectedUniversity || ''}
                            onChange={(e) => {
                                const universityId = e.target.value;
                                setSelectedUniversity(universityId);
                                setData('university', universityId);
                            }}
                        >
                            <option value="" hidden>Select your University</option>
                            {universities.map((university) => (
                                <option key={university.id} value={university.id}>
                                    {university.full_name}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.university} />
                    </div>
                    
                    {/* Faculty */}
                    {selectedUniversity && (
                        <div className='mt-4'>
                            <InputLabel htmlFor="faculty" value="Faculty" required />
                            <select
                                id="faculty"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={data.faculty || ''}
                                onChange={(e) => setData('faculty', e.target.value)}
                            >
                                <option value="" hidden>Select your Faculty</option>
                                {filteredFaculties.map((faculty) => (
                                    <option key={faculty.id} value={faculty.id}>
                                        {faculty.name}
                                    </option>
                                ))}
                            </select>
                            <InputError className="mt-2" message={errors.faculty} />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Create
                    </button>
                </form>
            </div>
        </MainLayout>
    );
};

export default FacultyAdminRegistration;
