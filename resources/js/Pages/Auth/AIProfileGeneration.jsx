import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function AIProfileGeneration() {
    const [activeOption, setActiveOption] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const { data, setData, reset, errors } = useForm({
        personalWebsite: '',
        institutionalWebsite: '',
        linkedinProfile: '',
        googleScholarProfile: '',
        researchgateProfile: ''
    });
    
    // Check if at least one URL is valid
    const hasValidUrl = () => {
        return Object.values(data).some(url => url && url.trim() !== '');
    };
    
    const handleOptionSelect = (option) => {
        setActiveOption(option);
        setErrorMessage('');
    };
    
    const handleAutomaticGeneration = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            // First, make the API call to trigger the generation process
            const response = await axios.post(route('ai.generate.automatic'));
            
            if (response.data.status === 'success' && response.data.generation_initiated) {
                // Only navigate to the profile edit page AFTER the generation has been initiated
                router.visit(route('role.edit'), {
                    preserveState: false,
                    onSuccess: () => {
                        setIsLoading(false);
                    }
                });
            } else {
                throw new Error('Generation could not be initiated');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred during AI profile generation');
            setIsLoading(false);
        }
    };
    
    const handleUrlsSubmit = async (e) => {
        e.preventDefault();
        
        if (!hasValidUrl()) {
            setErrorMessage('Please provide at least one URL to continue');
            return;
        }
        
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            // Transform the data to match what the backend expects
            const submissionData = {
                personalWebsite: data.personalWebsite,
                institutionalWebsite: data.institutionalWebsite,
                linkedinProfile: data.linkedinProfile,
                scholarProfile: data.googleScholarProfile,
                researchgateProfile: data.researchgateProfile
            };
            
            // First, make the API call to save URLs and trigger the generation process
            const response = await axios.post(route('ai.urls.save'), submissionData);
            
            if (response.data.status === 'success' && response.data.generation_initiated) {
                // Only navigate to the profile edit page AFTER URLs have been saved and generation initiated
                router.visit(route('role.edit'), {
                    preserveState: false,
                    onSuccess: () => {
                        setIsLoading(false);
                    }
                });
            } else {
                throw new Error('Generation could not be initiated');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred while saving URLs');
            setIsLoading(false);
        }
    };
    
    const handleSkip = () => {
        // When skipping, simply navigate to the role.edit route without any additional parameters
        router.visit(route('role.edit'));
    };
    
    return (
        <GuestLayout>
            <Head title="AI Profile Generation" />
            
            <div className="w-full sm:max-w-md px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Generate Your Academic Profile
                </h2>
                
                {errorMessage && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {errorMessage}
                    </div>
                )}
                
                {!activeOption ? (
                    <>
                        <p className="text-gray-600 mb-6">
                            Nexscholar can use AI to help you create your academic profile. How would you like to proceed?
                        </p>
                        
                        <div className="space-y-4">
                            <button
                                onClick={() => handleOptionSelect('automatic')}
                                className="w-full p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-start"
                            >
                                <span className="font-medium text-gray-800">Generate with Automatic Search</span>
                                <span className="text-sm text-gray-600 mt-1">
                                    We'll search the web for your academic information based on your name and institution.
                                </span>
                            </button>
                            
                            <button
                                onClick={() => handleOptionSelect('url')}
                                className="w-full p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-start"
                            >
                                <span className="font-medium text-gray-800">Generate Using My Profile URLs</span>
                                <span className="text-sm text-gray-600 mt-1">
                                    Provide your academic profile URLs for more accurate results.
                                </span>
                            </button>
                            
                            <button
                                onClick={handleSkip}
                                className="w-full p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-start"
                            >
                                <span className="font-medium text-gray-800">Skip AI Generation for Now</span>
                                <span className="text-sm text-gray-600 mt-1">
                                    You can always generate your profile later from your profile settings.
                                </span>
                            </button>
                        </div>
                    </>
                ) : activeOption === 'automatic' ? (
                    <>
                        <p className="text-gray-600 mb-6">
                            We'll search the web for your academic information and generate a profile for you. This may take a moment.
                        </p>
                        
                        <div className="flex items-center justify-between mt-6">
                            <button
                                onClick={() => setActiveOption(null)}
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                                disabled={isLoading}
                            >
                                Back
                            </button>
                            <PrimaryButton 
                                onClick={handleAutomaticGeneration} 
                                disabled={isLoading}
                                className="ml-4"
                            >
                                {isLoading ? 'Processing...' : 'Generate Profile'}
                            </PrimaryButton>
                        </div>
                    </>
                ) : activeOption === 'url' ? (
                    <>
                        <p className="text-gray-600 mb-6">
                            <strong>URL Search is generally more reliable as it uses the website links you provide.</strong> Please enter at least one URL to continue.
                        </p>
                        
                        <form onSubmit={handleUrlsSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="personalWebsite" value="Personal Website" />
                                    <TextInput
                                        id="personalWebsite"
                                        type="url"
                                        className="mt-1 block w-full"
                                        value={data.personalWebsite}
                                        onChange={(e) => setData('personalWebsite', e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                    />
                                    <InputError message={errors.personalWebsite} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="institutionalWebsite" value="Institutional Website" />
                                    <TextInput
                                        id="institutionalWebsite"
                                        type="url"
                                        className="mt-1 block w-full"
                                        value={data.institutionalWebsite}
                                        onChange={(e) => setData('institutionalWebsite', e.target.value)}
                                        placeholder="https://university.edu/faculty/you"
                                    />
                                    <InputError message={errors.institutionalWebsite} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="linkedinProfile" value="LinkedIn Profile" />
                                    <TextInput
                                        id="linkedinProfile"
                                        type="url"
                                        className="mt-1 block w-full"
                                        value={data.linkedinProfile}
                                        onChange={(e) => setData('linkedinProfile', e.target.value)}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                    <InputError message={errors.linkedinProfile} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="googleScholarProfile" value="Google Scholar Profile" />
                                    <TextInput
                                        id="googleScholarProfile"
                                        type="url"
                                        className="mt-1 block w-full"
                                        value={data.googleScholarProfile}
                                        onChange={(e) => setData('googleScholarProfile', e.target.value)}
                                        placeholder="https://scholar.google.com/citations?user=..."
                                    />
                                    <InputError message={errors.googleScholarProfile} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="researchgateProfile" value="ResearchGate Profile" />
                                    <TextInput
                                        id="researchgateProfile"
                                        type="url"
                                        className="mt-1 block w-full"
                                        value={data.researchgateProfile}
                                        onChange={(e) => setData('researchgateProfile', e.target.value)}
                                        placeholder="https://www.researchgate.net/profile/..."
                                    />
                                    <InputError message={errors.researchgateProfile} className="mt-2" />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => setActiveOption(null)}
                                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                                    disabled={isLoading}
                                >
                                    Back
                                </button>
                                <PrimaryButton
                                    type="submit"
                                    className="ml-4"
                                    disabled={isLoading || !hasValidUrl()}
                                >
                                    {isLoading ? 'Processing...' : 'Save URLs & Continue'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </>
                ) : null}
            </div>
        </GuestLayout>
    );
}
