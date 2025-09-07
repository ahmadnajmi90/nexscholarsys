import React from 'react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "NexScholar saves me hours every week by helping students find me based on my research focus. I now receive quality postgraduate inquiries with aligned interests.",
            name: "Dr. Muhammad Aliif Bin Ahmad",
            title: "Senior Lecturer at Universiti Teknologi Malaysia",
            image_url: "/images/people1.png"
        },
        {
            quote: "Before NexScholar, finding a supervisor and suitable grant was pure guesswork. Now I have access to everything—from proposal templates to funding alerts—in one place.",
            name: "Loh Yin Xia",
            title: "PhD Candidate at Universiti Kebangsaan Malaysia",
            image_url: "/images/people2.jpg"
        },
        {
            quote: "Through NexScholar's analytics dashboard, we can monitor national research trends and funding gaps. It's becoming an essential part of our grant evaluation workflow.",
            name: "Wong Yit Khee",
            title: "PhD Candidate at Universiti Teknologi Malaysia",
            image_url: "/images/people3.jpg"
        },
        {
            quote: "We use NexScholar not just for visibility—but also to validate instruments, manage research students, and build external collaboration pipelines.",
            name: "Dr. Kavintheran Thambiratnam",
            title: "Senior Lecturer at Universiti Islam Antarabangsa Malaysia",
            image_url: "/images/people4.jpeg"
        },
        // Duplicate testimonials for better infinite scroll effect
        {
            quote: "NexScholar saves me hours every week by helping students find me based on my research focus. I now receive quality postgraduate inquiries with aligned interests.",
            name: "Dr. Muhammad Aliif Bin Ahmad",
            title: "Senior Lecturer at Universiti Teknologi Malaysia",
            image_url: "/images/people1.png"
        },
        {
            quote: "Before NexScholar, finding a supervisor and suitable grant was pure guesswork. Now I have access to everything—from proposal templates to funding alerts—in one place.",
            name: "Loh Yin Xia",
            title: "PhD Candidate at Universiti Kebangsaan Malaysia",
            image_url: "/images/people2.jpg"
        }
    ];

    const featuredLogos = [
        { name: "Forbes", logo: "Forbes" },
        { name: "be[in]crypto", logo: "be[in]crypto" },
        { name: "THE WALL STREET JOURNAL", logo: "WSJ" },
        { name: "Money", logo: "Money" },
        { name: "THE FINTECH TIMES", logo: "FinTech Times" },
        { name: "CISION", logo: "CISION", subtitle: "PR Newswire" },
        { name: "COINTELEGRAPH", logo: "COINTELEGRAPH", subtitle: "The future of money" }
    ];

    return (
        <section id="testimonials" className="relative py-40 bg-[#f1f6f9]">
            
            {/* START: New Background Pattern Div */}
            <div className="absolute inset-0 z-0 opacity-50 overflow-hidden">
                <div 
                    className="absolute -left-1/4 -top-1/4 w-[150%] h-[150%]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='wave' patternUnits='userSpaceOnUse' width='800' height='800' patternTransform='rotate(10)'%3E%3Cpath d='M 0,100 Q 200,50 400,100 T 800,100' stroke='%23d1d5db' stroke-width='2' fill='none' /%3E%3Cpath d='M 0,200 Q 200,250 400,200 T 800,200' stroke='%23d1d5db' stroke-width='2' fill='none' /%3E%3Cpath d='M 0,300 Q 200,280 400,300 T 800,300' stroke='%23d1d5db' stroke-width='2' fill='none' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23wave)' /%3E%3C/svg%3E")`
                    }}
                />
            </div>
            {/* END: New Background Pattern Div */}

            <div className="max-w-7xl mx-auto relative px-6 lg:px-12">
                {/* Main Content - Two Column Layout */}
                <div className="grid lg:grid-cols-5 gap-16 mb-20">
                    {/* Left Column - Headline and Description */}
                    <div className="lg:col-span-2">
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            What are people saying?
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            NexScholar is transforming how students, researchers, and industry collaborate on research. But don't just take our word for it—here's what our users are saying.
                        </p>
                        <a
                            href={route('login')}
                            className="inline-flex items-center px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-gradient-to-r from-purple-600 to-pink-600 hover:text-white transition-all duration-300 font-semibold"
                        >
                            MEET THE TEAM
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>

                    {/* Right Column - Infinite Moving Cards */}
                    <div className="lg:col-span-3 w-full overflow-hidden">
                        <InfiniteMovingCards
                            items={testimonials}
                            direction="left"
                            speed="slow"
                            pauseOnHover={true}
                            className="py-4 sm:py-8"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection; 