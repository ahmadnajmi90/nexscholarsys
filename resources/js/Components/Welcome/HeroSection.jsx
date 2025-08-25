import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InfiniteScroll from '../ReactBits/InfiniteScroll';
import ReactPlayer from 'react-player';
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
    const [videoFailed, setVideoFailed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [videoReady, setVideoReady] = useState(false);

    // This effect ensures we only render the video on the client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // YouTube Player API implementation
    useEffect(() => {
        if (isMounted && !videoFailed) {
            // Load YouTube Player API
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }

            // Initialize player when API is ready
            window.onYouTubeIframeAPIReady = () => {
                new window.YT.Player('youtube-player', {
                    height: '100%',
                    width: '100%',
                    videoId: 'eynlF7Ph0UA',
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        iv_load_policy: 3,
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        mute: 1,
                        loop: 1,
                        playlist: 'eynlF7Ph0UA',
                        playsinline: 1,
                        cc_load_policy: 0,
                        color: 'white',
                        start: 0,
                        end: 0,
                        vq: 'hd1080'
                    },
                    events: {
                        onReady: (event) => {
                            console.log('YouTube Player ready - fading in');
                            setVideoReady(true);
                            // Hide all YouTube UI elements
                            const iframe = event.target.getIframe();
                            if (iframe) {
                                iframe.style.pointerEvents = 'none';
                                iframe.style.border = 'none';
                                iframe.style.outline = 'none';
                            }
                        },
                        onStateChange: (event) => {
                            if (event.data === window.YT.PlayerState.PLAYING) {
                                console.log('Video started playing');
                            }
                        },
                        onError: (event) => {
                            console.log('YouTube Player error:', event.data);
                            setVideoFailed(true);
                        }
                    }
                });
            };

            // If API is already loaded
            if (window.YT && window.YT.Player) {
                window.onYouTubeIframeAPIReady();
            }
        }
    }, [isMounted, videoFailed]);

    return (
        <>
            {/* SECTION 1: Main Hero with Video Background */}
            <section id="home" className="relative min-h-screen flex items-center overflow-hidden pb-24">

                {/* START: Fade-in Video Background System */}
                <div className="absolute inset-0 z-0 bg-black">
                    {/* Base Layer: Always visible fallback image */}
                    <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('/images/landing-background.png')` }}
                    ></div>
                    
                    {/* Middle Layer: Gradient overlay for aesthetics */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black opacity-70"></div>
                    
                    {/* Top Layer: Video with fade-in transition */}
                    {isMounted && !videoFailed && (
                        <div 
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                videoReady ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                                backgroundColor: videoReady ? 'transparent' : 'rgba(255,0,0,0.3)', // Debug: red background when not ready
                                border: videoReady ? 'none' : '2px solid red' // Debug: red border when not ready
                            }}
                        >
                            <div 
                                id="youtube-player"
                                className="react-player-simple"
                                style={{
                                    border: '2px solid blue', // Debug: blue border to see container
                                    backgroundColor: 'rgba(0,255,0,0.3)' // Debug: green background to see container
                                }}
                            />
                            {/* Dark overlay for video to ensure text readability */}
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    )}
                </div>
                {/* END: Fade-in Video Background System */}

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
                        <div className="space-y-10 text-center max-w-4xl">
                            {/* Pre-headline */}
                            <div className="text-white/70 text-sm font-semibold uppercase tracking-widest">
                                THE SMART ECOSYSTEM FOR RESEARCH EXCELLENCE
                            </div>
                            <p className='text-white'>{isMounted ? 'Mounted' : 'Not Mounted'}</p>
                            <p className='text-white'>{videoFailed ? 'Video Failed' : 'Video Loaded'}</p>
                            <p className='text-white'>{videoReady ? 'Video Ready' : 'Video Not Ready'}</p>
                            {/* Main Headline */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight font-serif">
                                The Smart 
                                <GradientText colors={['#a46ede', '#E91E63']} animationSpeed={10} showBorder={false}>
                                    Ecosystem
                                </GradientText> 
                                for Research Excellence
                            </h1>

                            {/* Description */}
                            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-sans-serif">
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
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: Partner Logos on White Background */}
            <section className="bg-white py-4">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Partner Logos */}
                    <div className="pt-4">
                        <div className="flex flex-wrap items-center gap-16 justify-center">
                            <img src="/images/utm.png" alt="UTM Logo" className="h-14" />
                            <img src="/images/mtdc.png" alt="MTDC Logo" className="h-14" />
                        </div>
                    </div>

                    {/* Horizontal Separator Line */}
                    <div className="mt-8 border-b border-gray-200 max-w-xl mx-auto"></div>
                </div>
            </section>
        </>
    );
};

export default HeroSection; 