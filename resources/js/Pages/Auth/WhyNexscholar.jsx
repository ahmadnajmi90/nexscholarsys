import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { cn } from '@/lib/utils';

export default function WhyNexscholar() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    const { data, setData, post, processing, errors } = useForm({
        main_reason: '',
        features_interested: [],
        additional_info: '',
    });

    const questions = [
        {
            id: 1,
            question: "What's your main reason for joining Nexscholar today?",
            type: 'single',
            options: [
                                { value: 'A', label: 'To find a research supervisor or specific research opportunities.' },
                                { value: 'B', label: 'To find students or collaborators for my research.' },
                                { value: 'C', label: 'To discover and follow research projects, publications, and grants.' },
                                { value: 'D', label: 'To build my academic profile and showcase my work.' },
                                { value: 'E', label: 'To network with other researchers and professionals in my field.' },
                                { value: 'F', label: 'To stay updated on academic events and news.' },
                                { value: 'G', label: 'I\'m just exploring the platform for now.' },
                                { value: 'H', label: 'Other.' },
            ]
        },
        {
            id: 2,
            question: "Which Nexscholar features or areas are you most excited to explore?",
            type: 'multiple',
            options: [
                                { value: 'A', label: 'AI-powered matching (for supervisors, students, or collaborators).' },
                                { value: 'B', label: 'Building and managing my detailed academic profile.' },
                                { value: 'C', label: 'Accessing the directory of universities, faculties, and researchers.' },
                                { value: 'D', label: 'Finding and sharing academic content (e.g., research updates, projects, events).' },
                                { value: 'E', label: 'Tools for CV generation or tracking research impact (like Google Scholar integration).' },
                                { value: 'F', label: 'General networking and connection features.' },
                                { value: 'G', label: 'I\'m not sure yet.' },
            ]
        },
        {
            id: 3,
            question: "Is there anything specific you're hoping to achieve, find, or suggest that wasn't covered above?",
            type: 'text',
            placeholder: "Please share your thoughts..."
        }
    ];

    const handleOptionSelect = (questionId, optionValue, type) => {
        if (type === 'single') {
            setData('main_reason', optionValue);
        } else if (type === 'multiple') {
            const updatedFeatures = data.features_interested.includes(optionValue)
                ? data.features_interested.filter(item => item !== optionValue)
                : [...data.features_interested, optionValue];
            setData('features_interested', updatedFeatures);
        }
    };

    const handleTextChange = (value) => {
        setData('additional_info', value);
    };

    const isStepValid = () => {
        const currentQuestion = questions[currentStep - 1];
        if (currentQuestion.type === 'single') {
            return data.main_reason !== '';
        } else if (currentQuestion.type === 'multiple') {
            return data.features_interested.length > 0;
        } else if (currentQuestion.type === 'text') {
            return data.additional_info.trim() !== '';
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('why-nexscholar.store'));
    };

    const currentQuestion = questions[currentStep - 1];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const progressVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const progressItemVariants = {
        hidden: { scale: 0.5, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const questionVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: 30,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    const optionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
            }
        })
    };

    const buttonVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.4,
                delay: 0.2,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    return (
        <GuestLayout>
            <Head title="Why Nexscholar?" />

            <motion.div
                className="w-full max-w-4xl mx-auto mt-2 p-4 sm:p-6 lg:p-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Progress Indicators */}
                <motion.div
                    className="flex justify-center mb-6 sm:mb-8"
                    variants={progressVariants}
                >
                    <div className="flex space-x-2 sm:space-x-3">
                        {Array.from({ length: totalSteps }, (_, index) => (
                            <motion.div
                                key={index}
                                className={cn(
                                    "w-8 h-2 sm:w-12 sm:h-3 rounded-full transition-all duration-300",
                                    index + 1 <= currentStep
                                        ? "bg-indigo-500"
                                        : "bg-gray-200"
                                )}
                                variants={progressItemVariants}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mx-2 sm:mx-0"
                    variants={itemVariants}
                >
                    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
                        {/* Question Header */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                className="text-left mb-6 sm:mb-8"
                                variants={questionVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="flex items-start sm:items-center justify-start mb-3 sm:mb-4">
                                    <motion.div
                                        className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base mr-3 sm:mr-4 flex-shrink-0 mt-1 sm:mt-0"
                                        whileHover={{ scale: 1.1, rotate: 360 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {currentStep}
                                    </motion.div>
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                                        {currentQuestion.question}
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-sm sm:text-base pl-8 sm:pl-10">
                                    {currentStep === 1 && "Help us understand what brings you to Nexscholar"}
                                    {currentStep === 2 && "Tell us which features excite you the most"}
                                    {currentStep === 3 && "Share any additional thoughts or specific goals"}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Options */}
                        <AnimatePresence mode="wait">
                            {currentQuestion.type !== 'text' && (
                                <motion.div
                                    key={`options-${currentStep}`}
                                    className="space-y-3 sm:space-y-4"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: {},
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {currentQuestion.options.map((option, index) => {
                                        const isSelected = currentQuestion.type === 'single'
                                            ? data.main_reason === option.value
                                            : data.features_interested.includes(option.value);

                                        return (
                                            <motion.button
                                                key={option.value}
                                                onClick={() => handleOptionSelect(currentQuestion.id, option.value, currentQuestion.type)}
                                                className={cn(
                                                    "w-full p-3 sm:p-4 lg:p-5 text-left rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:shadow-lg",
                                                    isSelected
                                                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                                                        : "border-gray-200 bg-white hover:border-gray-300"
                                                )}
                                                variants={optionVariants}
                                                custom={index}
                                                whileHover={{
                                                    scale: 1.02,
                                                    transition: { duration: 0.2 }
                                                }}
                                                whileTap={{
                                                    scale: 0.98,
                                                    transition: { duration: 0.1 }
                                                }}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                <div className="flex items-start">
                                                    {currentQuestion.type === 'multiple' && (
                                                        // Checkbox style for multiple selection only
                                                        <motion.div
                                                            className={cn(
                                                                "w-3 h-3 sm:w-4 sm:h-4 rounded border flex items-center justify-center mr-3 sm:mr-4 mt-1 sm:mt-1.5 flex-shrink-0 transition-colors",
                                                                isSelected
                                                                    ? "border-indigo-500 bg-indigo-500"
                                                                    : "border-gray-300"
                                                            )}
                                                            animate={{
                                                                scale: isSelected ? [1, 1.2, 1] : 1,
                                                                rotate: isSelected ? [0, 10, 0] : 0
                                                            }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            {isSelected && (
                                                                <motion.svg
                                                                    className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    initial={{ pathLength: 0 }}
                                                                    animate={{ pathLength: 1 }}
                                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                                >
                                                                    <motion.path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={3}
                                                                        d="M5 13l4 4L19 7"
                                                                        initial={{ pathLength: 0 }}
                                                                        animate={{ pathLength: 1 }}
                                                                        transition={{ duration: 0.3, delay: 0.1 }}
                                                                    />
                                                                </motion.svg>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                    <div className="flex-1">
                                                        <span className={cn(
                                                            "text-sm sm:text-base font-medium leading-relaxed",
                                                            isSelected ? "text-indigo-900" : "text-gray-700"
                                                        )}>
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Text Area for Question 3 */}
                        <AnimatePresence mode="wait">
                            {currentQuestion.type === 'text' && (
                                <motion.div
                                    key={`textarea-${currentStep}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <motion.textarea
                                        rows={5}
                                        className="w-full p-4 sm:p-5 lg:p-6 text-sm sm:text-base lg:text-lg rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 resize-none transition-colors"
                                        value={data.additional_info}
                                        onChange={(e) => handleTextChange(e.target.value)}
                                        placeholder={currentQuestion.placeholder}
                                        whileFocus={{
                                            scale: 1.01,
                                            transition: { duration: 0.2 }
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Display */}
                        {errors.main_reason && currentStep === 1 && (
                            <div className="text-red-500 text-center text-sm sm:text-base mb-3 sm:mb-4">{errors.main_reason}</div>
                        )}
                        {errors.features_interested && currentStep === 2 && (
                            <div className="text-red-500 text-center text-sm sm:text-base mb-3 sm:mb-4">{errors.features_interested}</div>
                        )}
                        {errors.additional_info && currentStep === 3 && (
                            <div className="text-red-500 text-center text-sm sm:text-base mb-3 sm:mb-4">{errors.additional_info}</div>
                        )}
                    </div>

                    {/* Navigation */}
                    <motion.div
                        className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 flex justify-between items-center"
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Back Button - Hidden for first question */}
                        <AnimatePresence>
                            {currentStep > 1 && (
                                <motion.button
                                    onClick={handleBack}
                                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 hover:shadow-xl flex items-center justify-center shadow-lg"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        whileHover={{ x: -2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </motion.div>
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Spacer for first question when back button is hidden */}
                        <AnimatePresence>
                            {currentStep === 1 && (
                                <motion.div
                                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Next/Submit Button */}
                        <motion.button
                            onClick={handleNext}
                            disabled={!isStepValid() || processing}
                            className={cn(
                                "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden",
                                isStepValid() && !processing
                                    ? "bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-xl"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            )}
                            variants={buttonVariants}
                            whileHover={isStepValid() && !processing ? "hover" : {}}
                            whileTap={isStepValid() && !processing ? "tap" : {}}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            {/* Ripple effect background */}
                            {isStepValid() && !processing && (
                                <motion.div
                                    className="absolute inset-0 bg-white opacity-20 rounded-full"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileHover={{ scale: 1, opacity: 0.1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            <motion.div
                                whileHover={isStepValid() && !processing ? { x: 2 } : {}}
                                transition={{ duration: 0.2 }}
                                className="relative z-10"
                            >
                                {processing ? (
                                    <motion.div
                                        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                ) : (
                                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                )}
                            </motion.div>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </GuestLayout>
    );
} 