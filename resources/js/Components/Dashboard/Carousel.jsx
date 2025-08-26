import React, { useState, useEffect, useRef } from "react";
import { Link } from '@inertiajs/react';
import { Eye, Heart, Share2 } from 'lucide-react';

const Carousel = ({
  items = [],
  cardType = 'featured', // 'featured' or 'regular'
  timer = 7000,
  fadeDuration = 300,
  className = "",
  label, // Optional label prop
  label_color
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const startXRef = useRef(null);
  const endXRef = useRef(null);

  // Auto-slide with fade transition
  useEffect(() => {
    if (!items.length) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setFade(true);
      }, fadeDuration);
    }, timer);
    return () => clearInterval(interval);
  }, [items, timer, fadeDuration]);

  // Dot click handler with fade effect
  const handleDotClick = (e, index) => {
    e.stopPropagation(); // Stop the click from bubbling to the parent Link
    e.preventDefault(); // Prevent the default link behavior

    if (index === currentIndex) return; // Do nothing if the same dot is clicked
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 300); // Should match fadeDuration
  };

  // Common swipe handler functions
  const handleSwipeStart = (x) => {
    startXRef.current = x;
  };

  const handleSwipeEnd = (x) => {
    endXRef.current = x;
    if (startXRef.current === null || endXRef.current === null) return;
    const swipeDistance = startXRef.current - endXRef.current;
    if (swipeDistance > 50) {
      // Swipe left: next slide
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setFade(true);
      }, fadeDuration);
    } else if (swipeDistance < -50) {
      // Swipe right: previous slide
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) =>
          prev === 0 ? items.length - 1 : prev - 1
        );
        setFade(true);
      }, fadeDuration);
    }
    startXRef.current = null;
    endXRef.current = null;
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleSwipeStart(e.touches[0].clientX);
  };
  const handleTouchMove = (e) => {};
  const handleTouchEnd = (e) => {
    handleSwipeEnd(e.changedTouches[0].clientX);
  };

  // Mouse events (for desktop simulation)
  const handleMouseDown = (e) => {
    handleSwipeStart(e.clientX);
  };
  const handleMouseUp = (e) => {
    handleSwipeEnd(e.clientX);
  };

  // Render Featured Card
  const renderFeaturedCard = (item) => (
    <div className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl">
      <div 
        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"
        style={{ backgroundImage: `url(${item.backgroundImage})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${item.bgColor} opacity-90 group-hover:opacity-80 transition-opacity duration-300`} />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
        <div className="flex items-start justify-between">
          <span className={`text-sm font-bold px-3 py-1 rounded-lg ${item.statusColor} backdrop-blur-md shadow-lg`}>
            {item.status}
          </span>
          {/* Pagination Dots in Top Right */}
          <div className="absolute top-6 right-6 flex space-x-2 z-20">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={(e) => handleDotClick(e, index)}
                className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
                  index === currentIndex ? 'bg-white opacity-100' : 'bg-white opacity-50 hover:opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-3 leading-tight">
            {item.title}
          </h1>
          <p className="text-sm opacity-90 mb-4 leading-relaxed">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <span className="opacity-75">{item.date}</span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{item.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{item.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="w-4 h-4" />
                  <span>{item.shares}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Regular Card
  const renderRegularCard = (item) => (
    <div className="relative h-44 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: `url(${item.backgroundImage})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${item.bgColor} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
      
      <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
        <div className="flex items-start justify-between">
          <span className={`text-xs font-bold px-2 py-1 rounded ${item.statusColor}`}>
            {item.status}
          </span>
          {/* Pagination Dots in Top Right */}
          <div className="absolute top-4 right-4 flex space-x-1 z-20">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={(e) => handleDotClick(e, index)}
                className={`w-1.5 h-1.5 rounded-full transition-opacity duration-300 ${
                  index === currentIndex ? 'bg-white opacity-100' : 'bg-white opacity-50 hover:opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2 leading-tight">
            {item.title}
          </h3>
          <p className="text-xs opacity-75">{item.date}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`relative h-full ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Optional Label at Top Left */}
      {label && (
        <div className={`absolute top-2 left-3 ${label_color} text-white px-2 py-1 text-xs font-bold rounded z-10`}>
          {label}
        </div>
      )}
      
      {items.length > 0 && (
        <>
          {/* Render the current slide with fade animation and clickable wrapper */}
          <div
            key={items[currentIndex].id}
            className={`transform h-full transition-opacity duration-${fadeDuration} ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link href={items[currentIndex].url || '#'} className="block h-full">
              {cardType === 'featured' 
                ? renderFeaturedCard(items[currentIndex])
                : renderRegularCard(items[currentIndex])
              }
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
