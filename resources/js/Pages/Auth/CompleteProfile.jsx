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
        current_postgraduate_status: '',
        current_undergraduate_status: '',
    });

    // State to hold the filtered faculties
    const [selectedUniversity, setSelectedUniversity] = useState(data.university);
    const filteredFaculties = faculties.filter(
        (faculty) => faculty.university_id === parseInt(selectedUniversity)
    );

    const handleStatusChange = (e) => {
        const status = e.target.value;
        setData((prevData) => ({
            ...prevData,
            current_postgraduate_status: prevData.role === 'Postgraduate' ? status : prevData.current_postgraduate_status,
            current_undergraduate_status: prevData.role === 'Undergraduate' ? status : prevData.current_undergraduate_status,
            university: status === "Registered" ? prevData.university : "", // Clear university if "Not registered yet"
            faculty: status === "Registered" ? prevData.faculty : "", // Clear faculty if "Not registered yet"
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.complete'), {
            onFinish: () => reset('full_name', 'university', 'role', 'industry', 'faculty'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Complete Profile" />

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Role" />
                    <select
                        id="role"
                        name="role"
                        className="mt-1 w-full border rounded-md p-2"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        required
                    >
                        <option value="" disabled>Select your Role</option>
                        <option value="Academician">Academician</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Undergraduate">Undergraduate</option>
                        {/* <option value="Industry">Industry</option> */}
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
                        {data.role === 'Postgraduate' && (
                            <>
                            {/* Current Postgraduate Status */}
                            <div className="mt-4">
                                <label
                                    htmlFor="current_postgraduate_status"
                                    className="mt-1 block text-sm font-medium text-gray-700"
                                >
                                    Current Postgraduate Status
                                </label>
                                <select
                                    id="current_postgraduate_status"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.current_postgraduate_status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="" hidden>
                                        Select your current postgraduate status
                                    </option>
                                    <option value="Not registered yet">Not registered yet</option>
                                    <option value="Registered">Registered</option>
                                </select>
                            </div>
                            </>
                        )}

                        {data.role === 'Undergraduate' && (
                            <>
                            {/* Current Undergraduate Status */}
                            <div className="mt-4">
                                <label
                                    htmlFor="current_undergraduate_status"
                                    className="mt-1 block text-sm font-medium text-gray-700"
                                >
                                    Current Undergraduate Status
                                </label>
                                <select
                                    id="current_undergraduate_status"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.current_undergraduate_status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="" hidden>
                                        Select your current undergraduate status
                                    </option>
                                    <option value="Not registered yet">Not registered yet</option>
                                    <option value="Registered">Registered</option>
                                </select>
                            </div>
                            </>
                        )}

                        {(data.role === 'Postgraduate'||data.role === 'Undergraduate') && (data.current_postgraduate_status === 'Registered'||data.current_undergraduate_status === 'Registered') && (
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
                                    <InputError className="mt-2" message={errors.faculty} />
                                </div>
                            )}
                        </>
                        )}

                        {data.role === 'Academician' && (
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
