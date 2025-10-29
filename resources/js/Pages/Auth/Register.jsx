import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [isAgreed, setIsAgreed] = useState(false); // State for the checkbox
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false); // State for password confirmation visibility

    // --- START: New Modal Logic ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('terms'); // 'terms' or 'privacy'
    const [termsContent, setTermsContent] = useState('');
    const [privacyContent, setPrivacyContent] = useState('');
    const [isLoadingContent, setIsLoadingContent] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const openModal = (tab) => {
        setActiveTab(tab);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (isModalOpen) {
            const contentToFetch = activeTab === 'terms' ? termsContent : privacyContent;
            const routeName = activeTab === 'terms' ? 'api.legal.terms' : 'api.legal.privacy';
            const setContent = activeTab === 'terms' ? setTermsContent : setPrivacyContent;

            if (!contentToFetch) { // Only fetch if content is not already loaded
                setIsLoadingContent(true);
                window.axios.get(route(routeName))
                    .then(response => {
                        setContent(response.data.content);
                    })
                    .catch(error => console.error(`Failed to fetch ${activeTab} content`, error))
                    .finally(() => setIsLoadingContent(false));
            }
        }
    }, [isModalOpen, activeTab]);

    const renderHtmlContent = (markdown) => {
        if (!markdown) return '';
        return markdown
            // First, handle markdown headings (must be before newline replacement)
            .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mt-4 mb-4">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-gray-900 mt-4 mb-2">$1</h3>')
            // Handle markdown-style links [text](/path) -> <a href="/path">text</a>
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 hover:text-indigo-800 underline">$1</a>')
            // Then handle bold and italic text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            // Remove newlines that come immediately after headings
            .replace(/(<h[1-3][^>]*>.*?<\/h[1-3]>)\s*\n/g, '$1')
            // Handle newlines more carefully - don't add <br /> after headings
            .replace(/\n(?=## )/g, '') // Remove newlines before ## headings
            .replace(/\n(?=### )/g, '') // Remove newlines before ### headings
            .replace(/\n(?=# )/g, '') // Remove newlines before # headings
            .replace(/\n/g, '<br />'); // Convert remaining newlines to <br />
    };
    // --- END: New Modal Logic ---

    return (
        <section className="bg-white">
            <Head title="Register" />
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                {/* Left Image Section */}
                <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt="Background"
                        src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                    <div className="hidden lg:relative lg:block lg:p-12">
                        <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                            Welcome to NexScholar
                        </h2>
                        <p className="mt-4 leading-relaxed text-white/90">
                            Empower your learning journey and achieve more with us.
                        </p>
                    </div>
                </section>

                {/* Right Form Section */}
                <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                    <div className="max-w-xl lg:max-w-3xl">
                        <h1 className="text-2xl font-bold sm:text-3xl text-center">Create an Account</h1>
                        <p className="mt-4 text-gray-500 text-center">
                            Start your journey with NexScholar by creating your account below.
                        </p>

                        <form onSubmit={submit} className="mt-8 grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                                <InputLabel htmlFor="name" value="Username" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm"
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoFocus
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="col-span-6">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <InputLabel htmlFor="password" value="Password" />
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="mt-1 w-full rounded-md border-gray-200 shadow-sm pr-12"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <Eye className="w-5 h-5" />
                                        ) : (
                                            <EyeOff className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                <div className="relative">
                                    <TextInput
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? "text" : "password"}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 w-full rounded-md border-gray-200 shadow-sm pr-12"
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                                        tabIndex={-1}
                                    >
                                        {showPasswordConfirmation ? (
                                            <Eye className="w-5 h-5" />
                                        ) : (
                                            <EyeOff className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                             {/* Checkbox Section */}
                             <div className="col-span-6">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={isAgreed}
                                        onChange={(e) => setIsAgreed(e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        I agree to the{' '}
                                        <button
                                            type="button"
                                            onClick={() => openModal('privacy')}
                                            className="text-blue-600 underline hover:text-blue-500 bg-transparent border-none cursor-pointer"
                                        >
                                            privacy policy
                                        </button>{' '}
                                        and{' '}
                                        <button
                                            type="button"
                                            onClick={() => openModal('terms')}
                                            className="text-blue-600 underline hover:text-blue-500 bg-transparent border-none cursor-pointer"
                                        >
                                            terms of use
                                        </button>
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="col-span-6">
                                <PrimaryButton
                                    className="w-full !justify-center !text-sm"
                                    disabled={processing || !isAgreed} // Disable if not agreed
                                >
                                    Create an Account
                                </PrimaryButton>
                            </div>

                            {/* Log in Link */}
                            <div className="col-span-6 text-center">
                                <p className="text-sm text-gray-500">
                                    Already have an account?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-blue-600 underline hover:text-blue-500"
                                    >
                                        Log in
                                    </Link>
                                </p>
                            </div>

                            {/* GOOGLE SIGN-UP SECTION */}
                            <div className="col-span-6">
                                <div className="flex items-center my-4">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="mx-2 text-gray-400 text-sm">OR</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                <div className="w-full">
                                    <PrimaryButton
                                        type="button"
                                        className="w-full !bg-white !text-gray-700 !border-gray-300 !justify-center hover:!bg-gray-50 !py-2.5 !font-medium !shadow-sm"
                                        disabled={processing || !isAgreed}
                                        onClick={() => window.location.href = route('auth.google')}
                                    >
                                        <FcGoogle className="mr-2 text-xl" />
                                        <span>Sign up with Google</span>
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            {/* --- NEW TABBED MODAL --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center pb-2 flex-shrink-0">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {activeTab === 'terms' ? 'Terms of Use' : 'Privacy Policy'}
                        </h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>


                    <div className="prose max-w-none mt-4 flex-grow overflow-y-auto max-h-[50vh] border-t border-gray-200">
                        {isLoadingContent ? (
                            <p>Loading...</p>
                        ) : (
                            <div
                                className="text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: renderHtmlContent(activeTab === 'terms' ? termsContent : privacyContent)
                                }}
                            />
                        )}
                    </div>

                    {/* --- MOVED AND REDESIGNED TAB NAVIGATION --- */}
                    <div className="mt-6 flex justify-center flex-shrink-0">
                        <nav className="flex space-x-2 bg-gray-50 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('terms')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    activeTab === 'terms' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:bg-white'
                                }`}
                            >
                                Terms of Use
                            </button>
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    activeTab === 'privacy' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:bg-white'
                                }`}
                            >
                                Privacy Policy
                            </button>
                        </nav>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
