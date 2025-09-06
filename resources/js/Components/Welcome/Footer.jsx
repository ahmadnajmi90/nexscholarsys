import React from "react";
import { GraduationCap, Facebook, Linkedin, Instagram, Youtube, ChevronDown } from "lucide-react";
import { useState } from "react";

const FooterSection = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const footerLinks = {
    "Navigate": [
      { name: "Home", href: "#home" },
      { name: "Features", href: "#features" },
      { name: "Latest Info", href: "#latest-info" },
      { name: "Testimonials", href: "#testimonials" }
    ],
    "Discover": [
      { name: "NexScholar AI", href: "#ai-features" },
      { name: "News & Events", href: "#news" },
      { name: "Login", href: route('login') },
      { name: "Register", href: route('register') }
    ],
    "Resources": [
      { name: "Mastering Your Profile & Onboarding", href: route('resources.category', 'mastering-profile') },
      { name: "Finding Your Match", href: route('resources.category', 'finding-match') },
      { name: "Managing Your Research", href: route('resources.category', 'managing-research') },
      // { name: "Blog & Case Studies", href: "#" },
      // { name: "Community & Ambassadors", href: "#" },
      // { name: "Documentation (RAG, Semantic Search)", href: "#" },
      // { name: "Service Status", href: "#" }
    ],
    "Legal & More": [
      { name: "Terms of Use", href: route('legal.terms') },
      { name: "Privacy Policy", href: route('legal.privacy') },
      { name: "Cookie Policy", href: route('legal.cookies') },
      { name: "Trust & Security", href: route('legal.security') }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/nexscholar/", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/nexscholar/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/nexscholar__", label: "Instagram" },
    { icon: Youtube, href: "https://www.youtube.com/@Nexscholar", label: "YouTube" },
  ];

  const toggleAccordion = (category) => {
    setOpenAccordion(openAccordion === category ? null : category);
  };

  return (
    <footer className="text-slate-200 py-12 lg:py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt="NexScholar" className="w-10 h-10" />
              <span className="text-xl font-semibold text-white">NexScholar</span>
            </div>
            <p className="text-slate-300 mb-6 max-w-sm text-sm leading-relaxed">
              Making research collaboration accessible for everyone—powered by AI, analytics, and RAG for trustworthy answers.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:scale-105 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Link Columns */}
          <div className="hidden md:contents">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-white mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        className="text-slate-400 hover:text-white transition-colors text-sm leading-relaxed"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden lg:col-span-4 space-y-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="border-b border-slate-700/50 pb-4">
                <button
                  onClick={() => toggleAccordion(category)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-white">
                    {category}
                  </h3>
                  <ChevronDown 
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openAccordion === category ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === category && (
                  <ul className="mt-3 space-y-2 pl-0">
                    {links.map((link) => (
                      <li key={link.name}>
                        <a 
                          href={link.href} 
                          className="text-slate-400 hover:text-white transition-colors text-sm block py-1"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-sm">
          <div className="text-slate-400">
            © 2025 NexScholar Sdn. Bhd. 202501003772 (1605185-U). A UTM Spin-Off Company. All rights reserved.
          </div>
          
          <div className="text-slate-400">
            Built with integrity for academia, industry & community.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;