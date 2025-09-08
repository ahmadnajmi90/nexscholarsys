import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Select from 'react-select';

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

    // Format universities for react-select
    const universityOptions = universities.map(university => ({
        value: university.id,
        label: university.full_name
    }));

    // Format faculties for react-select
    const facultyOptions = filteredFaculties.map(faculty => ({
        value: faculty.id,
        label: faculty.name
    }));

    // Get selected university option for react-select
    const selectedUniversityOption = universityOptions.find(option => option.value === parseInt(selectedUniversity));

    // Get selected faculty option for react-select
    const selectedFacultyOption = facultyOptions.find(option => option.value === parseInt(data.faculty));

    // Custom styles for react-select to match the design
    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            padding: '0.25rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none',
            borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
            '&:hover': {
                borderColor: '#9ca3af',
            },
            '@media (min-width: 640px)': {
                borderRadius: '0.75rem',
                padding: '0.375rem',
                fontSize: '1rem',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6b7280',
            fontSize: '0.875rem',
            '@media (min-width: 640px)': {
                fontSize: '1rem',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#111827',
            fontSize: '0.875rem',
            '@media (min-width: 640px)': {
                fontSize: '1rem',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#f3f4f6' : 'white',
            color: state.isSelected ? 'white' : '#111827',
            fontSize: '0.875rem',
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: state.isSelected ? '#6366f1' : '#e5e7eb',
            },
            '@media (min-width: 640px)': {
                fontSize: '1rem',
                padding: '0.625rem 0.875rem',
            },
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 9999,
            '@media (min-width: 640px)': {
                borderRadius: '0.75rem',
            },
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '200px',
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
    };

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

            <div className="w-full max-w-4xl mx-auto mt-2 p-4 sm:p-6 lg:p-8">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mx-2 sm:mx-0 p-4 sm:p-6 lg:p-8">
                    <ApplicationLogo></ApplicationLogo>
                    <form onSubmit={submit}>
                        <div className="mt-4 sm:mt-6">
                            <InputLabel htmlFor="role" value="Role" className="text-sm sm:text-base" />
                            <select
                                id="role"
                                name="role"
                                className="mt-1 w-full border border-gray-300 rounded-lg sm:rounded-xl p-3 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                                value={data.role}
                                onChange={(e) => {
                                    const newRole = e.target.value;
                                    // Reset all fields except full_name when role changes
                                    setData({
                                        full_name: data.full_name, // Keep full_name
                                        role: newRole,
                                        university: '',
                                        industry: '',
                                        faculty: '',
                                        current_postgraduate_status: '',
                                        current_undergraduate_status: '',
                                    });
                                    // Also reset the selected university state
                                    setSelectedUniversity('');
                                }}
                                required
                            >
                                <option value="" disabled>Select your Role</option>
                                <option value="Academician">Academician</option>
                                <option value="Postgraduate">Postgraduate</option>
                                <option value="Undergraduate">Undergraduate</option>
                                {/* <option value="Industry">Industry</option> */}
                            </select>
                            <InputError message={errors.role} className="mt-1 sm:mt-2 text-sm" />
                        </div>

                        <div className='mt-4 sm:mt-6'>
                            <InputLabel htmlFor="full_name" value="Full Name" className="text-sm sm:text-base"/>
                            <TextInput
                                id="full_name"
                                name="full_name"
                                value={data.full_name}
                                className="mt-1 block w-full border border-gray-300 rounded-lg sm:rounded-xl p-3 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                                autoComplete="full_name"
                                isFocused={true}
                                onChange={(e) => setData('full_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.full_name} className="mt-1 sm:mt-2 text-sm" />
                        </div>

                        {data.role !== 'Industry' ? (
                            <>
                                {data.role === 'Postgraduate' && (
                                    <>
                                    {/* Current Postgraduate Status */}
                                    <div className="mt-4 sm:mt-6">
                                        <label
                                            htmlFor="current_postgraduate_status"
                                            className="block text-sm sm:text-base font-medium text-gray-700"
                                        >
                                            Current Postgraduate Status
                                        </label>
                                        <select
                                            id="current_postgraduate_status"
                                            className="mt-2 block w-full border border-gray-300 rounded-lg sm:rounded-xl p-3 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
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
                                    <div className="mt-4 sm:mt-6">
                                        <label
                                            htmlFor="current_undergraduate_status"
                                            className="block text-sm sm:text-base font-medium text-gray-700"
                                        >
                                            Current Undergraduate Status
                                        </label>
                                        <select
                                            id="current_undergraduate_status"
                                            className="mt-2 block w-full border border-gray-300 rounded-lg sm:rounded-xl p-3 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
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
                                    <div className='mt-4 sm:mt-6'>
                                        <InputLabel htmlFor="university" value="University" required className="text-sm sm:text-base" />
                                        <div className="mt-2">
                                            <Select
                                                id="university"
                                                options={universityOptions}
                                                value={selectedUniversityOption || null}
                                                onChange={(selectedOption) => {
                                                    const universityId = selectedOption ? selectedOption.value : '';
                                                    setSelectedUniversity(universityId);
                                                    setData('university', universityId);
                                                }}
                                                placeholder="Search and select your university..."
                                                styles={selectStyles}
                                                isSearchable={true}
                                                isClearable={true}
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                            />
                                        </div>
                                        <InputError className="mt-1 sm:mt-2 text-sm" message={errors.university} />
                                    </div>

                                    {/* Faculty */}
                                    {selectedUniversity && (
                                        <div className='mt-4 sm:mt-6'>
                                            <InputLabel htmlFor="faculty" value="Faculty" required className="text-sm sm:text-base" />
                                            <div className="mt-2">
                                                <Select
                                                    id="faculty"
                                                    options={facultyOptions}
                                                    value={selectedFacultyOption || null}
                                                    onChange={(selectedOption) => {
                                                        const facultyId = selectedOption ? selectedOption.value : '';
                                                        setData('faculty', facultyId);
                                                    }}
                                                    placeholder="Search and select your faculty..."
                                                    styles={selectStyles}
                                                    isSearchable={true}
                                                    isClearable={true}
                                                    menuPortalTarget={document.body}
                                                    menuPosition="fixed"
                                                />
                                            </div>
                                            <InputError className="mt-1 sm:mt-2 text-sm" message={errors.faculty} />
                                        </div>
                                    )}
                                </>
                                )}

                                {data.role === 'Academician' && (
                                    <>
                                    {/* University */}
                                    <div className='mt-4 sm:mt-6'>
                                        <InputLabel htmlFor="university" value="University" required className="text-sm sm:text-base" />
                                        <div className="mt-2">
                                            <Select
                                                id="university"
                                                options={universityOptions}
                                                value={selectedUniversityOption || null}
                                                onChange={(selectedOption) => {
                                                    const universityId = selectedOption ? selectedOption.value : '';
                                                    setSelectedUniversity(universityId);
                                                    setData('university', universityId);
                                                }}
                                                placeholder="Search and select your university..."
                                                styles={selectStyles}
                                                isSearchable={true}
                                                isClearable={true}
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                            />
                                        </div>
                                        <InputError className="mt-1 sm:mt-2 text-sm" message={errors.university} />
                                    </div>

                                    {/* Faculty */}
                                    {selectedUniversity && (
                                        <div className='mt-4 sm:mt-6'>
                                            <InputLabel htmlFor="faculty" value="Faculty" required className="text-sm sm:text-base" />
                                            <div className="mt-2">
                                                <Select
                                                    id="faculty"
                                                    options={facultyOptions}
                                                    value={selectedFacultyOption || null}
                                                    onChange={(selectedOption) => {
                                                        const facultyId = selectedOption ? selectedOption.value : '';
                                                        setData('faculty', facultyId);
                                                    }}
                                                    placeholder="Search and select your faculty..."
                                                    styles={selectStyles}
                                                    isSearchable={true}
                                                    isClearable={true}
                                                    menuPortalTarget={document.body}
                                                    menuPosition="fixed"
                                                />
                                            </div>
                                            {data.role === 'Academician' && (
                                                <div className="mt-6 md:mt-8 lg:mt-8 bg-red-100 border border-red-400 text-red-600 px-3 py-2 rounded-lg">
                                                    <p className="text-xs sm:text-sm">
                                                        Select University and Faculty carefully because it is not allowed to change after this.
                                                    </p>
                                                </div>
                                            )}
                                            <InputError className="mt-1 sm:mt-2 text-sm" message={errors.faculty} />
                                        </div>
                                    )}
                                </>
                                )}
                            </>
                        ) : (
                            <div className="mt-4 sm:mt-6">
                                <InputLabel htmlFor="industry" value="Industry" className="text-sm sm:text-base" />
                                <TextInput
                                    id="industry"
                                    type="text"
                                    name="industry"
                                    value={data.industry}
                                    className="mt-2 block w-full border border-gray-300 rounded-lg sm:rounded-xl p-3 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                                    autoComplete="industry"
                                    onChange={(e) => setData('industry', e.target.value)}
                                    required
                                />
                                <InputError message={errors.industry} className="mt-1 sm:mt-2 text-sm" />
                            </div>
                        )}

                        <div className="flex items-center justify-end mt-6 sm:mt-8 lg:mt-10">
                            <PrimaryButton
                                className="px-4 py-3 text-base font-medium rounded-lg sm:rounded-xl hover:scale-105 transition-transform"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    'Complete Profile'
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
