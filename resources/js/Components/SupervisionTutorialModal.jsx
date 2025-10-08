import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, GraduationCap, Search, FolderOpen, MessageSquare, CheckCircle } from 'lucide-react';

const SupervisionTutorialModal = ({ show, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'How to Find Supervisors',
      subtitle: 'Two powerful methods to discover the perfect research supervisor',
      icon: Search,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4 py-2">
              <h4 className="font-semibold text-gray-900 mb-2">Method 1: Program Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span>Upload your CV and describe your research interests</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span>Get AI-matched postgraduate programs</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span>View supervisors associated with each program</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span>Add to shortlist or request supervision directly</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-semibold text-gray-900 mb-2">Method 2: AI Matching</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span>Use natural language search for specific research areas</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span>AI semantic search finds matching supervisors</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span>Filter by university, skills, and availability</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span>Add promising supervisors to your shortlist</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Potential Supervisors',
      subtitle: 'Manage your shortlisted supervisors and submit requests',
      icon: FolderOpen,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Your Potential Supervisors tab aggregates all supervisors you've shortlisted from both Program Recommendations and AI Matching.
          </p>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-indigo-100">
            <h4 className="font-semibold text-gray-900 mb-3">What you can do:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-indigo-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Connect with supervisors</p>
                  <p className="text-sm text-gray-600">Build your network before submitting a request</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-indigo-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Submit supervision requests</p>
                  <p className="text-sm text-gray-600">Click "Request" to submit your research proposal</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-indigo-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Manage your shortlist</p>
                  <p className="text-sm text-gray-600">Remove supervisors or view their profiles anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Proposal Status',
      subtitle: 'Track your requests and respond to supervisor decisions',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Once you submit a supervision request, track its progress in the Proposal Status tab.
          </p>

          <div className="space-y-3">
            <div className="border-l-4 border-amber-500 bg-amber-50 pl-4 py-3 rounded-r">
              <h5 className="font-semibold text-amber-900 text-sm">Pending</h5>
              <p className="text-xs text-amber-700 mt-1">Awaiting supervisor review. You can message them while waiting.</p>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-3 rounded-r">
              <h5 className="font-semibold text-blue-900 text-sm">Offer Received</h5>
              <p className="text-xs text-blue-700 mt-1">Supervisor sent an offer! Review and respond to accept or decline.</p>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 pl-4 py-3 rounded-r">
              <h5 className="font-semibold text-red-900 text-sm">Rejected</h5>
              <p className="text-xs text-red-700 mt-1">View the reason and explore recommended alternative supervisors.</p>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 pl-4 py-3 rounded-r">
              <h5 className="font-semibold text-green-900 text-sm">Accepted</h5>
              <p className="text-xs text-green-700 mt-1">Relationship established! All other pending requests are auto-cancelled.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Pro tip:</span> You can submit multiple requests, but once you accept an offer, all other pending requests will be automatically cancelled.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Active Supervision',
      subtitle: 'Manage your ongoing supervision relationship',
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Once you accept a supervisor's offer, the Manage Supervisor tab unlocks with powerful collaboration tools.
          </p>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-3 sm:p-4 border border-indigo-100">
              <h5 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 sm:mb-2">Meetings</h5>
              <p className="text-[10px] sm:text-xs text-gray-600">Schedule and track supervision meetings with your supervisor</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 sm:p-4 border border-purple-100">
              <h5 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 sm:mb-2">Onboarding</h5>
              <p className="text-[10px] sm:text-xs text-gray-600">Complete your onboarding checklist and track progress</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 border border-green-100">
              <h5 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 sm:mb-2">Documents</h5>
              <p className="text-[10px] sm:text-xs text-gray-600">Share and manage research documents collaboratively</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 sm:p-4 border border-amber-100">
              <h5 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 sm:mb-2">Communication</h5>
              <p className="text-[10px] sm:text-xs text-gray-600">Stay connected with direct messaging</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm font-medium">
              You're all set! Start your supervision journey by finding your perfect research supervisor.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!show) return null;

  const CurrentIcon = steps[currentStep].icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-5 sm:py-8">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <div className="flex items-center gap-3 sm:gap-4 pr-8">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <CurrentIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-indigo-100 text-xs sm:text-sm line-clamp-2 sm:line-clamp-1">
                    {steps[currentStep].subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 py-4 sm:py-8 overflow-y-auto max-h-[45vh] sm:max-h-[50vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {steps[currentStep].content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <div className="flex flex-col xs:flex-row items-center justify-between gap-3 xs:gap-0">
                {/* Progress Indicators */}
                <div className="flex gap-1.5 sm:gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? 'w-6 sm:w-8 bg-indigo-600'
                          : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2 w-full xs:w-auto">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex-1 xs:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Previous</span>
                  </button>
                  
                  {currentStep < steps.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex-1 xs:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <span className="text-xs sm:text-sm font-medium">Next</span>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleClose}
                      className="flex-1 xs:flex-initial px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <span className="text-xs sm:text-sm font-medium">Get Started</span>
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupervisionTutorialModal;

