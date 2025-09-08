import React from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';

export default function TutorialConfirmationModal({ show, onClose }) {
    return (
        <Modal show={show} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                            Tutorial Completed! 🎉
                        </h3>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600">
                        Great! You've completed the Nexscholar tutorial. You're now ready to explore all the features our platform has to offer.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        <span className="font-semibold text-green-700">
                            Need help later? <span className="underline">You can always revisit this tutorial</span> anytime from the <span className="underline">Tutorial Guide</span> in your <span className="underline">Settings</span> menu.
                        </span>
                    </p>
                </div>

                <div className="flex justify-end">
                    <PrimaryButton onClick={onClose}>
                        Get Started
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
