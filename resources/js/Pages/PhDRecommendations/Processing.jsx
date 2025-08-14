import React, { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import MainLayout from '@/Layouts/MainLayout';
import { Brain, FileText, Search, LineChart, CheckCircle2, RotateCw, Circle, Sparkles } from 'lucide-react';

const ALL_STATUSES = ['started', 'analyzing_cv', 'creating_profile', 'searching_database', 'generating_recommendations', 'completed'];

export default function Processing({ jobKey, isCached = false }) {
    const [status, setStatus] = useState('started');
    const [error, setError] = useState(null);
    
    // Derive a progress percentage from current status
    const progress = useMemo(() => {
        const idx = Math.max(0, ALL_STATUSES.indexOf(status));
        const denom = ALL_STATUSES.length - 1; // 'completed' == 100%
        return Math.min(100, Math.round((idx / denom) * 100));
    }, [status]);

    useEffect(() => {
        let simulationTimer;
        let pollingTimer;

        const runSimulation = (delay, stopAtEnd) => {
            let currentIndex = 1;
            simulationTimer = setInterval(() => {
                if (currentIndex < ALL_STATUSES.length - 1) {
                    setStatus(ALL_STATUSES[currentIndex]);
                    currentIndex++;
                } else {
                    if (stopAtEnd) {
                        setStatus(ALL_STATUSES[currentIndex]);
                    }
                    clearInterval(simulationTimer);
                }
            }, delay);
        };

        if (isCached) {
            // Fast simulation, then redirect
            runSimulation(300, false);
            const totalSimulationTime = 300 * ALL_STATUSES.length;
            setTimeout(() => {
                toast.success('Found your previous results!');
                router.visit(route('phd-recommendations.results'));
            }, totalSimulationTime);
        } else {
            // Slower simulation + background polling
            runSimulation(1500, true);

            pollingTimer = setInterval(() => {
                axios.get(route('phd-recommendations.status', { jobId: jobKey }))
                    .then(response => {
                        const { status: newStatus, error: newError } = response.data;

                        if (newStatus === 'completed') {
                            clearInterval(pollingTimer);
                            setStatus('completed');
                            toast.success('Analysis complete!');
                            setTimeout(() => {
                                router.visit(route('phd-recommendations.results'));
                            }, 1000);
                        } else if (newStatus === 'failed') {
                            clearInterval(pollingTimer);
                            setError(newError || 'An unknown error occurred.');
                            toast.error('Analysis failed.');
                        }
                    })
                    .catch(err => {
                        console.error('Polling error:', err);
                        setError('Could not get analysis status.');
                        clearInterval(pollingTimer);
                    });
            }, 3000);
        }

        return () => {
            clearInterval(simulationTimer);
            clearInterval(pollingTimer);
        };
    }, [jobKey, isCached]);

    // Step definitions for UI
    const steps = [
        {
            key: 'analyzing_cv',
            title: 'Analyzing your CV',
            description: 'Extracting skills, experience, and academic background...',
            icon: FileText,
        },
        {
            key: 'creating_profile',
            title: 'Understanding research interests',
            description: 'Processing your research keywords and preferences...',
            icon: Brain,
        },
        {
            key: 'searching_database',
            title: 'Searching supervisor database',
            description: 'Matching with 15,000+ academic profiles worldwide...',
            icon: Search,
        },
        {
            key: 'generating_recommendations',
            title: 'Calculating compatibility',
            description: 'Computing match scores based on research alignment...',
            icon: LineChart,
        },
    ];

    const renderRightStatusIcon = (state) => {
        if (state === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        if (state === 'active') return <RotateCw className="w-5 h-5 text-blue-600 animate-spin" />;
        return <Circle className="w-5 h-5 text-gray-300" />;
    };

    const statusIndex = Math.max(0, ALL_STATUSES.indexOf(status));

    return (
        <MainLayout title="Processing Request">
            <div className="min-h-[70vh] bg-gray-50 py-10">
                <div className="w-full max-w-3xl mx-auto">
                    {/* Top: circular brain icon and headings */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center relative">
                            <Brain className="w-10 h-10 text-blue-600" />
                            <span className="absolute inset-0 rounded-full border-2 border-blue-100 animate-pulse" />
                        </div>
                        <h1 className="mt-4 text-3xl font-bold text-gray-900">AI is analyzing your profile</h1>
                        <p className="mt-2 text-gray-600 max-w-2xl">
                            Please wait while we match you with suitable PhD programs and supervisors
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-8">
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-semibold text-blue-700">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-blue-600 rounded transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Steps list */}
                    <div className="mt-6 space-y-4">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const stepPos = ALL_STATUSES.indexOf(step.key);
                            const isCompleted = statusIndex > stepPos;
                            const isActive = statusIndex === stepPos || (status === 'started' && idx === 0);
                            const state = isCompleted ? 'completed' : isActive ? 'active' : 'pending';

                            return (
                                <div
                                    key={step.key}
                                    className={
                                        `flex items-start p-4 rounded-xl border transition-colors ` +
                                        (state === 'completed'
                                            ? 'bg-green-50 border-green-200'
                                            : state === 'active'
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-white border-gray-200')
                                    }
                                >
                                    <div className="flex-shrink-0">
                                        <div
                                            className={
                                                `w-10 h-10 rounded-full flex items-center justify-center ` +
                                                (state === 'completed'
                                                    ? 'bg-green-100'
                                                    : state === 'active'
                                                    ? 'bg-blue-100'
                                                    : 'bg-gray-100')
                                            }
                                        >
                                            <Icon
                                                className={
                                                    `w-5 h-5 ` +
                                                    (state === 'completed'
                                                        ? 'text-green-600'
                                                        : state === 'active'
                                                        ? 'text-blue-600'
                                                        : 'text-gray-400')
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                                                <p className="text-sm text-gray-600">{step.description}</p>
                                            </div>
                                            <div className="ml-4">{renderRightStatusIcon(state)}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Did you know */}
                    <div className="mt-8">
                        <div className="border rounded-lg bg-blue-50 border-blue-200 p-4 flex items-start">
                            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                            <p className="ml-3 text-sm text-blue-900">
                                <span className="font-semibold">Did you know?</span> Our AI analyzes over 50 research parameters to find the perfect supervisor match, including publication patterns, funding history, and research collaboration networks.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-8 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md" role="alert">
                            <p className="font-bold">An Error Occurred</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

