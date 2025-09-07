import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Marquee from '@/components/ui/marquee';
import { Link } from '@inertiajs/react';

const testimonials = [
  {
    id: 1,
    name: "Dr. Muhammad Aliif Bin Ahmad",
    designation: "Senior Lecturer",
    company: "Universiti Teknologi Malaysia",
    testimonial:
      "NexScholar saves me hours every week by helping students find me based on my research focus. I now receive quality postgraduate inquiries with aligned interests.",
    avatar: "/images/people1.png",
  },
  {
    id: 2,
    name: "Loh Yin Xia",
    designation: "PhD Candidate",
    company: "Universiti Kebangsaan Malaysia",
    testimonial:
      "Before NexScholar, finding a supervisor and suitable grant was pure guesswork. Now I have access to everything—from proposal templates to funding alerts—in one place.",
    avatar: "/images/people2.jpg",
  },
  {
    id: 3,
    name: "Wong Yit Khee",
    designation: "PhD Candidate",
    company: "Universiti Teknologi Malaysia",
    testimonial:
      "Through NexScholar's analytics dashboard, we can monitor national research trends and funding gaps. It's becoming an essential part of our grant evaluation workflow.",
    avatar: "/images/people3.jpg",
  },
  {
    id: 4,
    name: "Dr. Kavintheran Thambiratnam",
    designation: "Senior Lecturer",
    company: "Universiti Islam Antarabangsa Malaysia",
    testimonial:
      "We use NexScholar not just for visibility—but also to validate instruments, manage research students, and build external collaboration pipelines.",
    avatar: "/images/people4.jpeg",
  },
  {
    id: 5,
    name: "Dr. Muhammad Aliif Bin Ahmad",
    designation: "Senior Lecturer",
    company: "Universiti Teknologi Malaysia",
    testimonial:
      "NexScholar saves me hours every week by helping students find me based on my research focus. I now receive quality postgraduate inquiries with aligned interests.",
    avatar: "/images/people1.png",
  },
  {
    id: 6,
    name: "Loh Yin Xia",
    designation: "PhD Candidate",
    company: "Universiti Kebangsaan Malaysia",
    testimonial:
      "Before NexScholar, finding a supervisor and suitable grant was pure guesswork. Now I have access to everything—from proposal templates to funding alerts—in one place.",
    avatar: "/images/people2.jpg",
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-40 bg-[#f1f6f9] relative">
    {/* Background Pattern */}
    <div className="absolute inset-0 z-0 opacity-30 overflow-hidden">
      <div
        className="absolute -left-1/4 -top-1/4 w-[150%] h-[150%]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='wave' patternUnits='userSpaceOnUse' width='800' height='800' patternTransform='rotate(10)'%3E%3Cpath d='M 0,100 Q 200,50 400,100 T 800,100' stroke='%23d1d5db' stroke-width='2' fill='none' /%3E%3Cpath d='M 0,200 Q 200,250 400,200 T 800,200' stroke='%23d1d5db' stroke-width='2' fill='none' /%3E%3Cpath d='M 0,300 Q 200,280 400,300 T 800,300' stroke='%23d1d5db' stroke-width='2' fill='none' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23wave)' /%3E%3C/svg%3E")`
        }}
      />
    </div>

    <div className="max-w-7xl mx-auto relative px-6 lg:px-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h2 className="text-5xl text-purple-600 font-extrabold mb-6 leading-tight">
          What People Are Saying?
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-xl">
          NexScholar is transforming how students, researchers, and industry collaborate on research.
          But don't just take our word for it—here's what our users are saying.
        </p>
      </div>

      {/* Marquee Testimonials */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="z-10 absolute left-0 inset-y-0 w-[15%] bg-gradient-to-r from-[#f1f6f9] to-transparent" />
        <div className="z-10 absolute right-0 inset-y-0 w-[15%] bg-gradient-to-l from-[#f1f6f9] to-transparent" />

        {/* First Marquee Row */}
        <Marquee pauseOnHover className="[--duration:25s]">
          <TestimonialList />
        </Marquee>

        {/* Second Marquee Row (Reverse Direction) */}
        <Marquee pauseOnHover reverse className="mt-8 [--duration:25s]">
          <TestimonialList />
        </Marquee>
      </div>

      {/* CTA Button */}
      <div className="text-center mt-16">
        <Link
          href={route('login')}
          className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-xl"
        >
          MEET THE TEAM
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  </section>
);

const TestimonialList = () =>
  testimonials.map((testimonial) => (
    <div
      key={testimonial.id}
      className="min-w-96 max-w-sm bg-white rounded-xl p-6 shadow-lg border border-gray-100 mx-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Avatar src={testimonial.avatar} alt={testimonial.name}>
            <AvatarFallback className="text-xl font-medium bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-gray-900">{testimonial.name}</p>
            <p className="text-sm text-gray-600">{testimonial.designation}</p>
            <p className="text-xs text-purple-600 font-medium">{testimonial.company}</p>
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{testimonial.testimonial}</p>
    </div>
  ));

export default TestimonialsSection; 