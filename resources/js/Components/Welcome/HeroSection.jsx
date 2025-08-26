import React from 'react';
import { motion } from 'framer-motion';
import InfiniteScroll from '../ReactBits/InfiniteScroll';
import DarkVeil from '../ReactBits/DarkVeil';
import GradientText from '../ReactBits/GradientText';

const items = [
  { content: "AI-Powered Supervisor Matching" },
  { content: "Semantic Research Discovery" },
  { content: "Grant & Funding Alerts" },
  { content: "Real-Time Analytics Dashboards" },
  { content: "Collaborative Project Hubs" },
  { content: "Postgraduate Recommendations" },
  { content: "Industry Engagement Portal" },
  { content: "Automated RAG Insights" },
  { content: "Research Learning Hub" },
  { content: "Seamless University Integration" },
];

const HeroSection = () => {
    return (
        <>
            {/* SECTION 1: Main Hero with Animated Background */}
            <section id="home" className="relative min-h-screen flex items-center overflow-visible">

                {/* START: New DarkVeil Background */}
                <div className="absolute inset-0 z-0">
                    <DarkVeil
                        speed={2}
                        hueShift={10.0}
                        warpAmount={5}
                    />
                </div>
                {/* END: New DarkVeil Background */}

                {/* The existing background pattern can act as a layer on top */}
                <div className="absolute inset-0 opacity-10 z-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                {/* All other content must have a higher z-index to appear on top */}
                <div className="relative z-20 max-w-7xl mx-auto pt-24 px-6 lg:px-12">
                    <div className="flex justify-center items-center">
                        {/* Centered Content */}
                        <div className="space-y-10 text-center max-w-4xl text-gray-900">

                            {/* Main Headline */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight font-serif">
                                The Smart 
                                <GradientText colors={['#a46ede', '#E91E63']} animationSpeed={3} showBorder={false} className="inline-block">
                                    Ecosystem
                                </GradientText> 
                                for Research Excellence
                            </h1>

                            {/* Description */}
                            <p className="text-xl text-gray-900/80 max-w-2xl mx-auto leading-relaxed font-sans-serif">
                            NexScholar empowers students, researchers, academicians, and industry professionals to connect, collaborate, and thrive in a smart, data-driven academic ecosystem.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
                                <a
                                    href={route('login')}
                                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-xl text-base uppercase flex items-center justify-center font-sans-serif"
                                >
                                    Start your Research Journey 
                                </a>
                            </div>

                            {/* Partner Logos */}
                            <div className="pt-20">
                                <div className="flex flex-wrap items-center gap-16 justify-center">
                                    <p className="text-gray-900/80 text-sm font-semibold uppercase tracking-widest">
                                        Supported by
                                    </p>
                                    <img src="/images/utm.png" alt="UTM Logo" className="h-14" />
                                    <img src="/images/mtdc.png" alt="MTDC Logo" className="h-14" />
                                </div>
                            </div>

                            {/* Horizontal Separator Line */}
                            <div className="mt-8 border-b border-gray-200 max-w-xl mx-auto"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection; 