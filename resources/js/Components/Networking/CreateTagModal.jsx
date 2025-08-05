import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CreateTagModal = ({ show, onClose, onTagCreated }) => {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        setErrors({});
        
        try {
            const response = await axios.post('/connection-tags', { name });
            toast.success('Tag created successfully');
            setName('');
            
            // Call the callback function to update the tag list
            if (onTagCreated && typeof onTagCreated === 'function') {
                onTagCreated(response.data.tag);
            }
            
            onClose();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                toast.error('Please check the form for errors');
            } else {
                console.error('Error creating tag:', error);
                toast.error('Failed to create tag');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Tag</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <InputLabel htmlFor="name" value="Tag Name" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Enter tag name"
                            required
                            autoFocus
                        />
                        {errors.name && <InputError message={errors.name[0]} className="mt-2" />}
                    </div>
                    
                    <div className="flex items-center justify-end mt-6">
                        <SecondaryButton onClick={onClose} disabled={isSubmitting} className="mr-3">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Tag'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateTagModal;