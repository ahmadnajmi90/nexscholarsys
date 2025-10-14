import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { Head, useForm } from '@inertiajs/react';
import { FcGoogle } from 'react-icons/fc';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useRef } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const toastShown = useRef(false);

    // Show toast for password reset success (only once)
    useEffect(() => {
        if (status && status.includes('reset') && !toastShown.current) {
            toastShown.current = true;
            
            // Dismiss any existing toasts first to prevent duplicates
            toast.dismiss();
            
            // Show the success toast with a unique ID
            toast.success('Password reset successfully! You can now log in with your new password.', {
                id: 'password-reset-success',
                duration: 5000,
                position: 'top-center',
            });
        }
    }, [status]);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <Head title="Log in" />
            <section className="relative flex flex-col-reverse lg:flex-row lg:h-screen lg:items-center">

            {/* LEFT SIDE (Form Area) */}
            <div className="w-full px-4 py-8 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
                <div className="mx-auto w-full max-w-md">

                    {/* BRAND + HEADINGS (MOBILE) */}
                    <div className="mb-6 text-center lg:hidden">
                        <h1 className="ml-2 text-3xl text-blue-600 font-semibold">Nexscholar</h1>
                        <p className="mt-1 text-gray-500">Welcome back</p>
                        <p className="text-gray-500">Sign in to your account to continue</p>
                    </div>

                    {/* BRAND + HEADINGS (DESKTOP) */}
                    <div className="hidden lg:block text-center mb-8">
                        <h1 className="text-3xl font-bold">Welcome Back!</h1>
                        <p className="mt-4 text-gray-500">
                            Enter your email and password to access your account.
                        </p>
                    </div>

                    {/* Google Login Unavailable Notice */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Notice:</strong> Google Sign-In is temporarily unavailable while we complete the verification process. 
                            If you previously used Google to sign in, please click{' '}
                            <a href={route('password.request')} className="underline font-medium hover:text-blue-900">
                                "Forgot Password"
                            </a>{' '}
                            to reset your password and use the email login form below.
                        </p>
                    </div>

                    {/* SOCIAL SIGN-IN BUTTON (GOOGLE) - TEMPORARILY DISABLED FOR GOOGLE VERIFICATION */}
                    {/* 
                    <div className="flex flex-col sm:flex-row sm:space-x-2">
                        <a
                            href={route('auth.google')}
                            className="mb-3 sm:mb-0 flex items-center justify-center w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition"
                        >
                            <FcGoogle className="mr-2 text-xl" />
                            <span>Sign in with Google</span>
                        </a>
                    </div>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-2 text-gray-400 text-sm">OR CONTINUE WITH EMAIL</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    */}

                    {/* LOGIN FORM */}
                    <form onSubmit={submit} className="space-y-4">

                        {/* EMAIL FIELD */}
                        <div className="relative">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="Enter email"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <span className="absolute inset-y-0 right-4 grid place-content-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            </span>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* PASSWORD FIELD + FORGOT PASSWORD (MOBILE) */}
                        <div>
                            {/* 
                              Put the "Forgot?" link in the same row as the label on mobile,
                              hidden on large screens (block lg:hidden).
                            */}
                            <div className="flex items-center justify-between mb-1">
                                <InputLabel htmlFor="password" value="Password" />
                                {canResetPassword && (
                                    <a
                                        href={route('password.request')}
                                        className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 block lg:hidden"
                                    >
                                        Forgot Password?
                                    </a>
                                )}
                            </div>

                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    placeholder="Enter password"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <span className="absolute inset-y-0 right-4 grid place-content-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </span>
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                        </div>

                        {/* REMEMBER ME */}
                        <div className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </div>

                        {/* FORGOT PASSWORD (DESKTOP) + SIGN IN BUTTON */}
                        <div className="flex items-center justify-between">
                            {canResetPassword && (
                                <a
                                    href={route('password.request')}
                                    className="hidden lg:block rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Forgot your password?
                                </a>
                            )}
                            <button
                                type="submit"
                                className="inline-block w-full lg:w-auto rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
                                disabled={processing}
                            >
                                Sign in
                            </button>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-500">
                            Don’t have an account?{' '}
                            <a
                                href={route('register')}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign up
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            {/* RIGHT SIDE (Image) */}
            <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
                <img
                    alt="Login"
                    src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
            </section>
        </>
    );
}
