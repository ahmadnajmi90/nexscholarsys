import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaArrowLeft } from 'react-icons/fa';

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
        <>
            <Head title="Compose Email" />

            {/* Loading Modal */}
            <LoadingModal isOpen={sending} />

            <div className="relative min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-4 sm:px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Compose Message</h2>
                            <Link 
                                onClick={() => window.history.back()}
                                className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                            <div className="space-y-6">
                                {/* To Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">To:</label>
                                    <input
                                        type="email"
                                        value={formData.to}
                                        readOnly
                                        className="mt-1 w-full rounded-lg border-gray-300 p-3 sm:p-4 text-base shadow-sm bg-gray-50 cursor-not-allowed text-gray-700"
                                        placeholder="Recipient Email"
                                    />
                                </div>

                                {/* Reply-To Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Reply-To:</label>
                                    <input
                                        type="email"
                                        value={replyTo}
                                        readOnly
                                        className="mt-1 w-full rounded-lg border-gray-300 p-3 sm:p-4 text-base shadow-sm bg-gray-50 cursor-not-allowed text-gray-700"
                                        placeholder="Reply Email Address"
                                    />
                                </div>

                                {/* Subject Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Subject:</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                        className="mt-1 w-full rounded-lg border-gray-300 p-3 sm:p-4 text-base shadow-sm"
                                        placeholder="Enter Email Subject"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {/* Message Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Message:</label>
                                    <div className="mt-1 lg:min-h-[300px] md:min-h-[300px] min-h-[320px]">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.message}
                                            onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
                                            placeholder="Type your message here..."
                                            style={{ height: "250px", maxHeight: "400px" }}
                                            className="rounded-lg border-gray-300"
                                        />
                                    </div>
                                </div>

                                {/* Divider after attachments */}
                                <div className="border-t border-gray-200 my-2"></div>

                                {/* Attachments */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Attachments:</label>
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
                                        <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                    <span className="text-sm text-gray-600 truncate max-w-[calc(100%-2rem)]">
                                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Divider after attachments */}
                                <div className="border-t border-gray-200 my-2"></div>

                                {/* Action Buttons */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-medium"
                                    >
                                        <span>Send</span>
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
