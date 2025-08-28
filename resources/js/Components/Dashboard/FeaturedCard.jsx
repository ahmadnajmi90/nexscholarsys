import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Award, Bell, BookOpen, DollarSign, Globe, Clock } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

const FeaturedCard = ({ posts = [] }) => {
  const { auth } = usePage().props;
  const user = auth.user;
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Helper function to create a clean excerpt from HTML content
  const createExcerpt = (html, length = 100) => {
      if (!html) return '';
      const plainText = html.replace(/<[^>]*>/g, '');
      if (plainText.length <= length) return plainText;
      return plainText.substring(0, length) + '...';
  };

  // Map the incoming 'posts' prop to the structure the component needs
  const notifications = posts.length > 0 
    ? posts.slice(0, 5).map(post => ({
        id: post.id,
        badge: post.category || 'LATEST POST',
        title: post.title,
        subtitle: createExcerpt(post.content, 80), // Create a short subtitle
        buttonText: 'View Post',
        backgroundImage: post.featured_image ? `/storage/${post.featured_image}` : '/storage/default.jpg',
        gradient: [
          'from-blue-500 to-cyan-600',
          'from-purple-500 to-pink-600',
          'from-green-500 to-teal-600',
          'from-orange-500 to-red-600',
          'from-indigo-500 to-violet-600'
        ][post.id % 5], // Rotate between 5 different gradients based on post ID
        url: route('posts.show', post.url) // Add the URL for the button link
    }))
    : [{ // Fallback notification when no posts are available
        id: 1,
        badge: 'WELCOME',
        title: 'No Posts Available',
        subtitle: 'Check back later for new content',
        buttonText: 'Explore',
        backgroundImage: '/storage/default.jpg',
        gradient: 'from-blue-500 to-cyan-600',
        url: route('dashboard')
    }];

  // Auto-rotate notifications every 5 seconds
  useEffect(() => {
    if (notifications.length <= 1) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length);
        setIsAnimating(false);
      }, 300); // Animation duration
    }, 5000);
    return () => clearInterval(interval);
  }, [notifications.length]);

  const handleBulletClick = (index) => {
    if (index === currentNotification) return; // Don't animate if clicking the same slide
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentNotification(index);
      setIsAnimating(false);
    }, 300); // Animation duration
  };

  const currentNotif = notifications[currentNotification];

  if (notifications.length === 0) {
    return <div className="bg-gray-200 rounded-2xl p-8 mb-8 h-full min-h-[200px]"></div>;
  }

  return (
    <div className="rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden text-white min-h-[200px]">
      
      {/* START: New Robust Background Rendering */}
      <div className="absolute inset-0 z-0">
        {notifications.map((notif, index) => (
          <div
            key={notif.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentNotification ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={notif.backgroundImage}
              alt={notif.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${notif.gradient} opacity-85`} />
          </div>
        ))}
      </div>
      {/* END: New Robust Background Rendering */}
      
      <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
        {/* Main Content */}
        <div className={`w-full md:flex-1 transition-all duration-700 ease-in-out ${
          !user.academician?.scholar_profile ? 'mb-8 md:mb-4 lg:mb-4' : ''
        }`}>
          <div className={`text-xs text-white font-medium mb-2 bg-white bg-opacity-20 px-3 py-1 rounded-full inline-block transition-all duration-500 ease-out transform ${
            isAnimating ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            {currentNotif.badge}
          </div>
          <h2 className={`text-lg md:text-xl font-bold mb-2 transition-all duration-500 ease-out transform max-w-[700px] line-clamp-1 ${
            isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            {currentNotif.title}
          </h2>
          <p className={`text-sm opacity-90 mb-4 transition-all duration-500 ease-out transform ${
            isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            {currentNotif.subtitle}
          </p>
          <Link href={currentNotif.url}>
            <button className={`bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all duration-500 ease-out transform hover:scale-105 ${
              isAnimating ? 'translate-y-4 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'
            }`}>
              {currentNotif.buttonText}
            </button>
          </Link>
        </div>
        
        {/* Stats Section */}
        {user.academician?.scholar_profile && (
          <div className="w-full md:flex-1 relative mb-8 md:mb-0 lg:mb-0">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: BookOpen, value: user.academician.total_publications, label: 'Publications', color: 'text-white' },
                { icon: TrendingUp, value: user.academician.scholar_profile.total_citations, label: 'Citations', color: 'text-white' },
                { icon: Award, value: user.academician.scholar_profile.h_index, label: 'h-index', color: 'text-white' },
                { icon: Users, value: user.collaborator_count, label: 'Collaborations', color: 'text-white' }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-3 md:p-4 text-center hover:bg-opacity-30 hover:scale-105 transition-all duration-200"
                  >
                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-white" />
                    <div className="text-sm md:text-lg font-bold">{stat.value}</div>
                    <div className="text-xs opacity-80">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Notification Dots - Positioned like in the image (bottom-left area) */}
      <div className="absolute bottom-6 left-8 flex space-x-3 z-20">
        {notifications.map((_, index) => (
          <button
            key={index}
            onClick={() => handleBulletClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-500 hover:scale-125 ${
              index === currentNotification 
                ? 'bg-white shadow-lg scale-110' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-70'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default FeaturedCard;