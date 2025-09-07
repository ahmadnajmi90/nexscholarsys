import React from 'react';
import { ArrowRight } from "lucide-react";
import { Link } from '@inertiajs/react';


const ResearchJourneySection = () => {
    const features = [
        {
            category: "For Students",
            title: "Plan your postgraduate future",
            details: "Easily discover suitable supervisors, grants, and journals tailored to your interest and readiness.",
            tutorialLink: "/postgraduate-recommendations",
            image_url: "/images/student.png"
        },
        {
            category: "For Academicians",
            title: "Build your research network",
            details: "Attract potential postgrads, manage projects, validate instruments, and monitor trends with intelligent dashboards.",
            tutorialLink: "/connections",
            image_url: "/images/academicians.png"
        },
        {
            category: "For Industry & Agencies",
            title: "Connect to academic intelligence",
            details: "Collaborate with researchers, offer research grants, and analyze national research directions using big data insights.",
            tutorialLink: "/academicians",
            image_url: "/images/industry.png"
        }
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Headline */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight max-w-xl md:text-center md:mx-auto text-gray-900">
                        Your Research Journey Starts Here
                    </h2>
                </div>

                {/* Features Alternating Layout */}
                <div className="w-full mx-auto space-y-20">
                    {features.map((feature, index) => (
                        <div
                            key={feature.category}
                            className="flex flex-col md:flex-row items-center gap-x-20 gap-y-6 md:odd:flex-row-reverse"
                        >
                            {/* Image Section */}
                            <div className="w-full aspect-[6/4] bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 rounded-xl border border-purple-200/50 basis-1/2 relative overflow-hidden">
                                <img
                                    src={feature.image_url}
                                    alt={feature.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="basis-1/2 shrink-0">
                                <span className="uppercase font-semibold text-sm text-purple-600">
                                    {feature.category}
                                </span>
                                <h4 className="my-3 text-3xl font-semibold tracking-tight text-gray-900">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-600 text-[17px] leading-relaxed">
                                    {feature.details}
                                </p>
                                <Link
                                    href={feature.tutorialLink}
                                    className="inline-flex items-center mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg"
                                >
                                    Learn More
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ResearchJourneySection; 