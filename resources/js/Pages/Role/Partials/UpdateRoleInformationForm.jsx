import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AcademicianForm from './AcademicianForm';
import PostgraduateForm from './PostgraduateForm';
import UndergraduateForm from './UndergraduateForm';

export default function UpdateProfileInformation({
    isPostgraduate,
    isAcademician,
    universities,
    faculties,
    className = '',
    researchOptions
}) {
    const academician = usePage().props.academician; // Related academician data
    const postgraduate = usePage().props.postgraduate; // Related postgraduate data
    const undergraduate = usePage().props.undergraduate; // Related undergraduate data
    const isUndergraduate = usePage().props.isUndergraduate; // Related undergraduate data

    return (
        <>
            {academician && (<AcademicianForm academician={academician} researchOptions={researchOptions}/> )}
            {postgraduate && (<PostgraduateForm postgraduate={postgraduate} universities={universities} faculties={faculties} researchOptions={researchOptions} /> )}
            {undergraduate && (<UndergraduateForm undergraduate={undergraduate} universities={universities} faculties={faculties} researchOptions={researchOptions} /> )}
        </>
    );
}
