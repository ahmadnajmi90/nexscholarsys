import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { usePage } from '@inertiajs/react';

const AssignAbilities = ({ role, abilities, assignedAbilities }) => {
    const { data, setData, post, processing, errors } = useForm({
        abilities: assignedAbilities || [],
    });

    // Initialize abilities when component mounts or when assignedAbilities changes
    useEffect(() => {
        setData('abilities', assignedAbilities || []);
    }, [assignedAbilities]);

    const handleCheckboxChange = (abilityId) => {
        const updatedAbilities = data.abilities.includes(abilityId)
            ? data.abilities.filter(id => id !== abilityId)
            : [...data.abilities, abilityId];
            
        setData('abilities', updatedAbilities);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('roles.abilities.update', { role: role.id }), {
            onSuccess: () => {
            alert('Abilities updated successfully!');
            }
        });
    };

    return (
        <MainLayout title="">
            <div>
                <h1 className="text-2xl font-semibold mb-4 pl-2">Assign Abilities to {role.title}</h1>
                <form onSubmit={handleSubmit} className='p-2'>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {abilities.map((ability) => (
                            <label key={ability.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={ability.id}
                                    checked={data.abilities.includes(ability.id)}
                                    onChange={() => handleCheckboxChange(ability.id)}
                                />
                                <span>{ability.title}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {processing ? 'Updating...' : 'Update Abilities'}
                        </button>
                    </div>
                </form>
                {errors && Object.keys(errors).length > 0 && (
                    <div className="mt-2 text-red-600">
                        {Object.values(errors).map((error, idx) => (
                            <div key={idx}>{error}</div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default AssignAbilities;