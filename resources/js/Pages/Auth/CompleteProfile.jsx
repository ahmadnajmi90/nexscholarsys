import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function CompleteProfile({ universities, faculties }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        university: '',
        role: '',
        industry: '',
        faculty: '', // Add faculty field to the form state
    });

    // State to hold the filtered faculties
    const [selectedUniversity, setSelectedUniversity] = useState(data.university);
    const filteredFaculties = faculties.filter(
        (faculty) => faculty.university_id === parseInt(selectedUniversity)
    );

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.complete'), {
            onFinish: () => reset('full_name', 'university', 'role', 'industry', 'faculty'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Role" />
                    <select
                        id="role"
                        name="role"
                        className="w-full border rounded-md p-2"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        required
                    >
                        <option value="" disabled>Select your Role</option>
                        <option value="Academician">Academician</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Industry">Industry</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className='mt-4'>
                    <InputLabel htmlFor="full_name" value="Full Name"/>
                    <TextInput
                        id="full_name"
                        name="full_name"
                        value={data.full_name}
                        className="mt-1 block w-full"
                        autoComplete="full_name"
                        isFocused={true}
                        onChange={(e) => setData('full_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.full_name} className="mt-2" />
                </div>

                {data.role !== 'Industry' ? (
                    <>
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
                                {data.role === 'Academician' && <p className="mt-2 text-red-500 text-sm">*Select carefully as it is not allowed to change after this</p>}
                                <InputError className="mt-2" message={errors.faculty} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="mt-4 text-sm">
                        <InputLabel htmlFor="industry" value="Industry" />
                        <TextInput
                            id="industry"
                            type="text"
                            name="industry"
                            value={data.industry}
                            className="mt-1 block w-full"
                            autoComplete="industry"
                            onChange={(e) => setData('industry', e.target.value)}
                            required
                        />
                        <InputError message={errors.industry} className="mt-2" />
                    </div>
                )}

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Complete Profile
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
