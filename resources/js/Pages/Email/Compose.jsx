import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Compose({ auth, to, replyTo }) {
    const [attachments, setAttachments] = useState([]);
    const [alert, setAlert] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        to: to,
        subject: '',
        message: '',
    });

    useEffect(() => {
        // Clear alert after 5 seconds
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create a new FormData instance
        const formData = new FormData();
        
        // Append basic data
        formData.append('to', data.to);
        formData.append('subject', data.subject);
        formData.append('message', data.message);
        
        // Log attachment information
        console.log('Number of attachments:', attachments.length);
        attachments.forEach((file, index) => {
            console.log(`Attaching file ${index + 1}:`, {
                name: file.name,
                size: file.size,
                type: file.type
            });
            // Append each file to formData with a simple name
            formData.append('attachments[]', file);
        });

        // Log the FormData contents for debugging
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        
        post(route('email.send'), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            headers: {
                Accept: 'application/json',
            },
            onBefore: () => {
                console.log('Preparing to send...');
            },
            onSuccess: (page) => {
                console.log('Success response:', page);
                const success = page.props?.flash?.success;
                const error = page.props?.flash?.error;
                const message = page.props?.flash?.message;

                if (success) {
                    alert("Email sent successfully.");
                    setAlert({ type: 'success', message });
                    setAttachments([]);
                    reset('subject', 'message');
                    
                    // Show success alert and refresh after 2 seconds
                    setTimeout(() => {
                        router.reload();
                    }, 2000);
                } else if (error) {
                    setAlert({ type: 'error', message });
                }
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
                alert("Failed to send email. Please check your input and try again.");
                setAlert({ 
                    type: 'error', 
                    message: 'Failed to send email. Please check your input and try again.' 
                });
            },
            onFinish: () => {
                console.log('Request finished');
            }
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log('Files selected:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
        setAttachments(prevFiles => [...prevFiles, ...files]);
    };

    const removeAttachment = (index) => {
        setAttachments(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Compose Email" />

            <div className="max-w-7xl mx-auto p-4">
                {alert && (
                    <div className={`mb-4 p-4 rounded-lg ${
                        alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {alert.message}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold">Compose Message</h2>
                        <hr className="my-4 border-gray-200" />

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {/* To Field */}
                                <div className="flex items-center py-2">
                                    <label className="w-20 text-gray-600">To:</label>
                                    <input
                                        type="email"
                                        value={data.to}
                                        readOnly
                                        className="flex-1 outline-none bg-transparent"
                                    />
                                </div>
                                <hr className="border-gray-200" />

                                {/* Reply-To Field */}
                                <div className="flex items-center py-2">
                                    <label className="w-20 text-gray-600">Reply-To:</label>
                                    <input
                                        type="email"
                                        value={replyTo}
                                        readOnly
                                        className="flex-1 outline-none bg-transparent"
                                    />
                                </div>
                                <hr className="border-gray-200" />

                                {/* Subject Field */}
                                <div className="flex items-center py-2">
                                    <label className="w-20 text-gray-600">Subject:</label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        className="flex-1 outline-none"
                                        required
                                    />
                                </div>
                                <hr className="border-gray-200" />

                                {/* Message Label */}
                                <div className="py-2">
                                    <label className="text-gray-600">Message:</label>
                                </div>

                                {/* Message Editor */}
                                <div className="min-h-[400px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={data.message}
                                        onChange={(value) => setData('message', value)}
                                        placeholder="Type your message here..."
                                        style={{ height: "300px", maxHeight: "300px" }}
                                    />
                                </div>
                                <hr className="border-gray-200 mt-8" />

                                {/* Attachments */}
                                <div className="py-4">
                                    <label className="block text-gray-600 mb-2">Attachments:</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        multiple
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                    />
                                    {errors.attachments && (
                                        <div className="text-red-500 text-sm mt-1">{errors.attachments}</div>
                                    )}
                                    {attachments.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <span className="text-sm text-gray-600">
                                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <hr className="border-gray-200" />

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2"
                                    >
                                        <span>{processing ? 'Sending...' : 'Send'}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
