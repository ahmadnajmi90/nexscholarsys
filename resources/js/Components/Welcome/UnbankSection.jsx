import React from 'react';
import { ArrowRight, Rocket, Users, Target } from "lucide-react";

const GetStartedSection = () => {
  const steps = [
    {
      icon: Rocket,
      title: "Create your NexScholar account",
      description: "Accessible via web platform – no install required",
      cta: "Sign Up"
    },
    {
      icon: Users,
      title: "Set up your academic profile", 
      description: "Add your field, institution, interests & keywords for accurate matching",
      cta: "Learn More"
    },
    {
      icon: Target,
      title: "Get matched instantly",
      description: "Discover grants, supervisors, collaborators & tools based on AI-RAG",
      cta: "Learn More"
    }
  ];

  return (
    <section id="unbank" className="py-40 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Section - Illustration */}
          <div className="text-center lg:text-left">
            {/* 3D Illustration Icons */}
            <div className="relative w-80 h-64 mx-auto lg:mx-0 mb-8">
              {/* Main Dashboard Icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl rotate-12">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded"></div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-8 left-12 w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl shadow-xl transform -rotate-12 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute top-16 right-8 w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-xl transform rotate-45 flex items-center justify-center">
                <Users className="w-6 h-6 text-white transform -rotate-45" />
              </div>
              
              <div className="absolute bottom-12 left-8 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-xl transform rotate-12 flex items-center justify-center">
                <Target className="w-6 h-6 text-white transform -rotate-12" />
              </div>
              
              <div className="absolute bottom-8 right-16 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-xl"></div>
              
              {/* Chat Bubble */}
              <div className="absolute top-4 right-20 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-lg"></div>
            </div>
            
            {/* Headline */}
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">
              Start your research journey
            </h2>
            <h2 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              in 3 simple steps!
            </h2>
          </div>

          {/* Right Section - Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center justify-between p-6 border-l-4 border-gradient-to-b from-pink-500 to-purple-600 bg-white/5 backdrop-blur-sm rounded-r-xl hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Step Number & Icon */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <a
                    href={route('register')}
                    className="inline-flex items-center text-white hover:text-pink-400 hover:bg-white/10 group ml-4 text-sm font-medium uppercase tracking-wide px-4 py-2 rounded transition-colors duration-200"
                  >
                    {step.cta}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;