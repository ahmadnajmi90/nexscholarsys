import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react'; // Import useState if not already imported

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [isAgreed, setIsAgreed] = useState(false); // State for the checkbox

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <section className="bg-white">
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
                        <h1 className="text-2xl font-bold sm:text-3xl">Create an Account</h1>
                        <p className="mt-4 text-gray-500">
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
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />
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
                                        <a
                                            href="#"
                                            className="text-blue-600 underline hover:text-blue-500"
                                        >
                                            data privacy
                                        </a>{' '}
                                        and{' '}
                                        <a
                                            href="#"
                                            className="text-blue-600 underline hover:text-blue-500"
                                        >
                                            terms and conditions
                                        </a>
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                <PrimaryButton
                                    className="w-full sm:w-auto"
                                    disabled={processing || !isAgreed} // Disable if not agreed
                                >
                                    Create an Account
                                </PrimaryButton>
                                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                    Already have an account?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-blue-600 underline hover:text-blue-500"
                                    >
                                        Log in
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-4">
                            <a
                                href={route('auth.google')}
                                className="flex items-center pl-4 w-60 py-2 bg-[#4285F4] text-white font-medium rounded-lg shadow-md hover:bg-[#357ae8] transition"
                            >
                                <div className="bg-white p-2 rounded-lg mr-3">
                                    <img
                                        src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
                                        alt="Google Logo"
                                        className="w-5 h-5"
                                    />
                                </div>
                                <span>Register with Google</span>
                            </a>
                        </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    );
}
