import React from 'react';
import { HandHeart, Search, BarChart3, Brain, Building2, GraduationCap } from "lucide-react";

// Mobile Feature Card Sub-component
const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 leading-snug">{description}</p>
    </div>
);

const FinanceSection = () => {
    const features = [
        {
          icon: HandHeart,
          title: "AI-Powered Matchmaking",
          description: "Instantly match students with supervisors, grants, and collaborators based on AI-inferred preferences, research field, and readiness."
        },
        {
          icon: Search,
          title: "Research Discovery",
          description: "Explore active research topics, funding calls, publications, and datasets intelligently filtered for your needs."
        },
        {
          icon: BarChart3,
          title: "Research Analytics & Dashboards",
          description: "Visualize research outputs, proposal stages, grant statuses, and student supervision metrics in real time."
        },
        {
          icon: Brain,
          title: "Semantic & RAG-Based Discovery",
          description: "Retrieve context-aware answers and insights by combining LLM with your documents via Retrieval-Augmented Generation (RAG)."
        },
        {
          icon: Building2,
          title: "Industry Engagement",
          description: "Connect with industry partners, explore contract research needs, and align academic goals with commercial impact."
        },
        {
          icon: GraduationCap,
          title: "Research Learning & Enrichment Hub",
          description: "Access personalized learning paths, writing templates, instrument validators, and self-paced micro-training."
        }
      ];

    return (
        <section id="ai-features" className="py-40 bg-white relative">
            {/* Purple Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-transparent to-blue-100/30"></div>
            
            <div className="max-w-7xl mx-auto relative px-6 lg:px-12">
                {/* Headline */}
                <div className="text-center mb-24">
                    <h3 className="text-purple-600 text-lg font-semibold mb-4">
                        A New Era of Intelligent Research
                    </h3>
                    <h2 className="text-5xl font-black text-gray-900 mb-6">
                        Discover NexScholar AI
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-xl">
                        NexScholar leverages Artificial Intelligence and Retrieval-Augmented Generation (RAG) to revolutionize how students, academicians, and industries explore research, discover opportunities, and build impactful collaborations — all in one intelligent ecosystem.
                    </p>
                    <a
                        href={route('login')}
                        className="mt-10 inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-xl text-lg"
                    >
                        Explore NexScholar AI
                    </a>
                </div>

                {/* DESKTOP VIEW: Features Wheel (hidden on mobile) */}
                <div className="hidden lg:block relative w-[1000px] h-[1000px] mx-auto">
                    {/* Central Core */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48">
                        {/* Background Circle */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full shadow-2xl"></div>
                        
                        {/* Inner Circle with Logo */}
                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
                        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <img src="/images/logo.png" alt="NexScholar Logo" className="w-12 h-12 object-contain" />
                        </div>
                        </div>
                    </div>

                    {/* Feature Points */}
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const angle = (index * 60) - 90; // Start from top and go clockwise
                        const radius = 380; // Distance from center - increased for more spacing
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius;
                        
                        return (
                        <div key={index}>
                            {/* Connecting Line */}
                            <div
                            className="absolute w-0.5 bg-gradient-to-r from-violet-300 to-transparent z-10"
                            style={{
                                top: '50%',
                                left: '50%',
                                height: `${radius}px`,
                                transformOrigin: 'top center',
                                transform: `translate(-50%, 0) rotate(${angle + 90}deg)`
                            }}
                            />
                            
                            {/* Feature Card */}
                            <div
                            className="absolute w-72 group cursor-pointer z-20"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: `translate(${x - 144}px, ${y - 90}px)`
                            }}
                            >
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group-hover:border-violet-200 group-hover:scale-105">
                                {/* Icon */}
                                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                <Icon className="w-6 h-6 text-white" />
                                </div>
                                
                                {/* Content */}
                                <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">
                                {feature.title}
                                </h3>
                                <p className="text-sm text-slate-600 text-center leading-snug">
                                {feature.description}
                                </p>
                            </div>
                            </div>
                        </div>
                        );
                    })}
                </div>

                {/* MOBILE VIEW: Simple Grid Layout (only visible on mobile) */}
                <div className="lg:hidden grid grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard 
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FinanceSection; 