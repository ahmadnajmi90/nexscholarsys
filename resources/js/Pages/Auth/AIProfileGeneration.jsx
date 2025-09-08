import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import axios from 'axios';
import { router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AIProfileGeneration({ userRole, showAllOptions }) {
    const [activeOption, setActiveOption] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const fileInputRef = useRef(null);
    
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
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCvFile(file);
            setErrorMessage('');
        }
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
    
    const handleCVSubmit = async (e) => {
        e.preventDefault();
        
        if (!cvFile) {
            setErrorMessage('Please upload a CV file to continue');
            return;
        }
        
        // Validate file size (max 10MB) and type
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/tiff'];
        
        if (cvFile.size > maxSize) {
            setErrorMessage('File size exceeds 10MB limit. Please upload a smaller file.');
            return;
        }
        
        if (!allowedTypes.includes(cvFile.type)) {
            setErrorMessage('File type not supported. Please upload PDF, DOC, DOCX, JPEG, PNG, or TIFF files.');
            return;
        }
        
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            // First, save the CV to the user's profile
            const cvFormData = new FormData();
            cvFormData.append('CV_file', cvFile);
            
            console.log('Uploading CV file to profile via role.updateCV route');
            
            // Call the CV update route first
            const updateResponse = await axios.post(route('role.updateCV'), cvFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (!updateResponse.data.success) {
                throw new Error('Failed to upload CV to profile: ' + (updateResponse.data.error || 'Unknown error'));
            }
            
            console.log('CV upload successful, now initiating profile generation');
            
            // Now create form data to submit for processing
            const formData = new FormData();
            formData.append('CV_file', cvFile); // Use CV_file consistently
            
            // Make the API call to process the CV and trigger generation
            console.log('Sending CV for processing via ai.generate.cv route');
            const response = await axios.post(route('ai.generate.cv'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log('CV processing response:', response.data);
            
            // Check for a successful response - various success formats possible
            if (
                response.data.status === 'success' || 
                (typeof response.data === 'object' && response.data.full_name) ||
                response.data.generation_initiated
            ) {
                // Navigate to the profile edit page after CV has been processed
                console.log('CV processing successful, navigating to profile edit page');
                
                // Add query parameter to indicate generation was initiated
                router.visit(route('role.edit', { generation_initiated: true }), {
                    preserveState: false,
                    onSuccess: () => {
                        setIsLoading(false);
                    }
                });
            } else {
                console.error('CV generation response format unexpected:', response.data);
                throw new Error('Generation could not be initiated: Invalid response format');
            }
        } catch (error) {
            console.error('CV processing error:', error);
            setErrorMessage(error.response?.data?.error || error.message || 'An error occurred while processing your CV');
            setIsLoading(false);
        }
    };
    
    const handleSkip = () => {
        // When skipping, simply navigate to the role.edit route without any additional parameters
        router.visit(route('role.edit'));
    };
    
    // Determine which options to show based on user role
    const showAutomaticOption = showAllOptions;
    const showUrlOption = showAllOptions;
    const showCvOption = true; // CV option is available for all roles
    
    return (
        <GuestLayout>
            <Head title="AI Profile Generation" />
            
            <div className="w-full max-w-2xl mx-auto mt-2 p-4 sm:p-6 lg:p-8">
            <ApplicationLogo></ApplicationLogo>
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mx-2 sm:mx-0 p-6 md:p-8 lg:p-8 mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-2 text-left md:text-center lg:text-center">
                        Generate Your {userRole === 'academician' ? 'Academic' : (userRole === 'postgraduate' ? 'Postgraduate' : 'Undergraduate')} Profile
                    </h2>
                    
                    {errorMessage && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                            {errorMessage}
                        </div>
                    )}
                    
                    {!activeOption ? (
                        <>
                            <p className="text-gray-600 mb-6 text-left md:text-center lg:text-center">
                                Nexscholar can use AI to help you create your profile. How would you like to proceed?
                            </p>
                            
                            <div className="space-y-4">
                                {showAutomaticOption && (
                                <button
                                    onClick={() => handleOptionSelect('automatic')}
                                    className="w-full p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-start"
                                >
                                    <span className="font-medium text-gray-800">Generate with Automatic Search</span>
                                    <span className="text-sm text-gray-600 mt-1 text-left">
                                        We'll search the web for your academic information based on your name and institution.
                                    </span>
                                </button>
                                )}
                                
                                {showUrlOption && (
                                <button
                                    onClick={() => handleOptionSelect('url')}
                                    className="w-full p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-start"
                                >
                                    <span className="font-medium text-gray-800">Generate Using My Profile URLs</span>
                                    <span className="text-sm text-gray-600 mt-1 text-left">
                                        Provide your academic profile URLs for more accurate results.
                                    </span>
                                </button>
                                )}
                                
                                {showCvOption && (
                                    <button
                                        onClick={() => handleOptionSelect('cv')}
                                        className="w-full p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-start"
                                    >
                                        <span className="font-medium text-gray-800">Generate From My CV</span>
                                        <span className="text-sm text-gray-600 mt-1 text-left">
                                            Upload your CV for us to extract information and generate your profile.
                                        </span>
                                    </button>
                                )}
                                
                                <button
                                    onClick={handleSkip}
                                    className="w-full p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-start"
                                >
                                    <span className="font-medium text-gray-800">Skip AI Generation for Now</span>
                                    <span className="text-sm text-gray-600 mt-1 text-left">
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
                                            disabled={isLoading || !hasValidUrl()}
                                            className="ml-4"
                                        >
                                            {isLoading ? 'Processing...' : 'Generate Profile'}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : activeOption === 'cv' ? (
                        <>
                            <p className="text-gray-600 mb-6">
                                <strong>CV-based profile generation can extract information directly from your resume.</strong> Please upload your CV to continue.
                            </p>
                            
                            <form onSubmit={handleCVSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="cv_file" value="Upload Your CV" />
                                        <input
                                            id="cv_file"
                                            type="file"
                                            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                                            ref={fileInputRef}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Supported formats: PDF, DOCX, DOC, JPEG, PNG, TIFF
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveOption(null);
                                                setCvFile(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className="text-sm text-gray-600 hover:text-gray-900 underline"
                                            disabled={isLoading}
                                        >
                                            Back
                                        </button>
                                        <PrimaryButton 
                                            type="submit"
                                            disabled={isLoading || !cvFile}
                                        className="ml-4"
                                    >
                                            {isLoading ? 'Processing...' : 'Generate Profile'}
                                    </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : null}
                </div>
            </div>
        </GuestLayout>
    );
}
