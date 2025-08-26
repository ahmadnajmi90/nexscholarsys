import React from 'react';

const FeatureCard = ({ title, subtitle, description, linkText, image_url }) => {
    return (
        <div className="bg-white rounded-lg p-8 hover:shadow-2xl transition-all duration-300 shadow-xl border border-gray-100 relative overflow-hidden font-[sans-serif]">
            {/* Main Content */}
            <div className="space-y-2">
                <h3 className="text-purple-600 font-bold text-lg">{subtitle}</h3>
                {/* Title */}
                <h4 className="text-2xl font-extrabold text-gray-900 leading-tight">{title}</h4>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-normal font-sans !mt-6">{description}</p>

                {/* Call to Action */}
                <div className="flex items-center !mt-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full mr-4"></div>
                    <a href="#" className="inline-flex items-center text-gray-900 hover:text-purple-600 font-semibold text-normal uppercase tracking-wide group">
                        {linkText}
                        <span className="ml-2 text-sm group-hover:translate-x-1 transition-transform">&gt;</span>
                    </a>
                </div>
            </div>

            {/* Isometric Illustration Placeholder */}
            <div className="mt-8 h-48 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 rounded-xl relative overflow-hidden">
                <img
                    src={image_url}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

const ResearchJourneySection = () => {
    const features = [
        {
            title: "Plan your postgraduate future",
            subtitle: "For Students",
            description: "Easily discover suitable supervisors, grants, and journals tailored to your interest and readiness.",
            linkText: "Start Planning",
            image_url: "/images/student.png"
        },
        {
            title: "Build your research network",
            subtitle: "For Academicians",
            description: "Attract potential postgrads, manage projects, validate instruments, and monitor trends with intelligent dashboards.",
            linkText: "Build Network",
            image_url: "/images/academicians.png"
        },
        {
            title: "Connect to academic intelligence",
            subtitle: "For Industry & Agencies",
            description: "Collaborate with researchers, offer research grants, and analyze national research directions using big data insights.",
            linkText: "Connect Now",
            image_url: "/images/industry.png"
        }
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Headline */}
                <div className="text-center mb-24">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-6 font-[sans-serif]">
                        Your Research Journey Starts Here
                    </h2>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ResearchJourneySection; 