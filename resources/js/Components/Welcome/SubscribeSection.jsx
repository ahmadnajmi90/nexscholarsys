import React from "react";
import { Mail, Shield } from "lucide-react";
import { useState } from "react";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState({
    funding: true,
    events: true,
    product: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
//   const { toast } = useToast();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError("");
    setSuccessMessage("");
    
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email.");
    }
  };

  const handlePreferenceChange = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    const selectedTopics = Object.entries(preferences)
      .filter(([_, selected]) => selected)
      .map(([topic, _]) => topic);

    if (selectedTopics.length === 0) {
      alert("Please select at least one subscription type.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage("Thanks! Please check your email to confirm your subscription.");
      setEmail("");
      alert("Subscription successful! Please check your email to confirm your subscription.");
    } catch (error) {
      setEmailError("Hmm, something went wrong. Please try again.");
      alert("Subscription failed. Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="subscribe" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Subscribe to stay informed
          </h2>
          <p className="text-base lg:text-lg text-slate-500 mb-8 max-w-3xl mx-auto">
            Get curated alerts on funding, conferences & workshops, and NexScholar's AI + RAG features delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="max-w-2xl mx-auto">
              {/* Email Input and Subscribe Button Container */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Email Input Field */}
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input 
                      type="email" 
                      placeholder="Your email address"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full h-14 pl-12 pr-4 rounded-xl bg-white shadow-inner border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent text-base ${
                        emailError ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? "email-error" : undefined}
                    />
                  </div>
                  {emailError && (
                    <p id="email-error" className="text-red-500 text-sm mt-1 text-left" aria-live="polite">
                      {emailError}
                    </p>
                  )}
                </div>
                
                {/* Subscribe Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting || !!emailError}
                  className="flex-shrink-0 h-14 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Mail className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </div>

            {successMessage && (
              <p className="text-green-600 text-sm font-medium" aria-live="polite">
                {successMessage}
              </p>
            )}

            <div className="space-y-3 max-w-2xl mx-auto">
              <p className="text-sm font-medium text-slate-700 mb-2">Subscription Preferences:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="funding"
                    checked={preferences.funding}
                    onChange={() => handlePreferenceChange('funding')}
                    className="border-slate-300"
                  />
                  <label htmlFor="funding" className="text-sm text-slate-600 cursor-pointer">
                    Funding alerts
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="events"
                    checked={preferences.events}
                    onChange={() => handlePreferenceChange('events')}
                    className="border-slate-300"
                  />
                  <label htmlFor="events" className="text-sm text-slate-600 cursor-pointer">
                    Events (Conference/Workshop)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="product"
                    checked={preferences.product}
                    onChange={() => handlePreferenceChange('product')}
                    className="border-slate-300"
                  />
                  <label htmlFor="product" className="text-sm text-slate-600 cursor-pointer">
                    Product & AI/RAG updates
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 max-w-2xl mx-auto">
              <Shield className="w-4 h-4" />
              <span>
                We respect your privacy. 
                <button type="button" className="underline hover:text-slate-700 transition-colors ml-1">
                  Unsubscribe anytime
                </button>
                . View our 
                <button type="button" className="underline hover:text-slate-700 transition-colors ml-1">
                  Privacy Policy
                </button>
                .
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;