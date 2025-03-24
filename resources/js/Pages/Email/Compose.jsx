import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Loading Modal Component
const LoadingModal = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <h3 className="text-lg font-semibold">Sending Email...</h3>
                <p className="text-gray-600 mt-2">Please wait while your email is being sent.</p>
            </div>
        </div>
    );
};

export default function Compose({ auth, to, replyTo }) {
    const [attachments, setAttachments] = useState([]);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        to: to,
        subject: '',
        message: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        const submitData = new FormData();
        submitData.append('to', formData.to);
        submitData.append('subject', formData.subject);
        submitData.append('message', formData.message);

        // Handle attachments
        if (attachments.length > 0) {
            console.log('Number of attachments:', attachments.length);
            attachments.forEach((file, index) => {
                console.log(`Attaching file ${index + 1}:`, {
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
                submitData.append(`attachments[${index}]`, file);
            });
        }

        // Log FormData contents for debugging
        console.log('FormData entries:');
        for (let [key, value] of submitData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: File: ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }

        try {
            const response = await fetch('/email/send', {
                method: 'POST',
                body: submitData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                },
                credentials: 'same-origin'
            });

            const result = await response.json();

            if (result.success) {
                console.log('Email sent successfully:', result);
                
                // Show alert before navigation
                window.alert(result.message || 'Email sent successfully!');
                console.log('Alert shown, navigating back...');
                
                // Navigate back
                window.history.back();
            } else {
                throw new Error(result.message || 'Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            window.alert(error.message || 'Failed to send email. Please try again.');
        } finally {
            setSending(false);
        }
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

            {/* Loading Modal */}
            <LoadingModal isOpen={sending} />

            <div className="max-w-7xl mx-auto p-4">
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
                                        value={formData.to}
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
                                        value={formData.subject}
                                        onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
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
                                        value={formData.message}
                                        onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
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
                                        disabled={sending}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        <span>Send</span>
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
