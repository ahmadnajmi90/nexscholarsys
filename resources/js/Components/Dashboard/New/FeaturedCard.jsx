import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Award, Bell, BookOpen, DollarSign, Globe, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';

const FeaturedCard = ({ posts = [] }) => {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 250);
    }, 5000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  const handleBulletClick = (index) => {
    if (index !== currentNotification) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentNotification(index);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 250);
    }
  };

  const currentNotif = notifications[currentNotification];

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 relative overflow-hidden text-white">
      {/* Real Background Image with Fade Overlay Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentNotif.backgroundImage})` }}
      />
      
      {/* Dynamic Gradient Overlay that changes with notification */}
      <div className={`absolute inset-0 bg-gradient-to-r ${currentNotif.gradient} opacity-85 transition-all duration-1000 ease-in-out`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className={`flex-1 transition-all duration-700 ease-in-out ${
          isTransitioning ? 'opacity-0 transform translate-y-6' : 'opacity-100 transform translate-y-0'
        }`}>
          <div className={`text-xs text-white font-medium mb-2 bg-white bg-opacity-20 px-3 py-1 rounded-full inline-block transition-all duration-700 ease-in-out ${
            isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}>
            {currentNotif.badge}
          </div>
          <h2 className={`text-xl font-bold mb-2 transition-all duration-700 ease-in-out ${
            isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`} style={{ transitionDelay: isTransitioning ? '0ms' : '200ms' }}>
            {currentNotif.title}
          </h2>
          <p className={`text-sm opacity-90 mb-4 transition-all duration-700 ease-in-out ${
            isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`} style={{ transitionDelay: isTransitioning ? '0ms' : '400ms' }}>
            {currentNotif.subtitle}
          </p>
          <Link href={currentNotif.url}>
            <button className={`bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all duration-700 hover:scale-105 ${
              isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`} style={{ transitionDelay: isTransitioning ? '0ms' : '600ms' }}>
              {currentNotif.buttonText}
            </button>
          </Link>
        </div>
        
        <div className="flex-1 relative">
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: BookOpen, value: '42', label: 'Publications', color: 'text-white' },
              { icon: TrendingUp, value: '156', label: 'Citations', color: 'text-white' },
              { icon: Award, value: '18', label: 'h-index', color: 'text-white' },
              { icon: Users, value: '24', label: 'Students', color: 'text-white' }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-opacity-30 hover:scale-105 transition-all duration-200"
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-2 text-white" />
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs opacity-80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
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

      {/* Enhanced Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear shadow-sm"
          style={{ 
            width: `${((currentNotification + 1) / notifications.length) * 100}%`,
            animation: 'progress 5s linear infinite'
          }}
        />
      </div>
    </div>
  );
};

export default FeaturedCard;