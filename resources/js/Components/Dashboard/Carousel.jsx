import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Eye, Heart, Share2 } from 'lucide-react';

const Carousel = ({
  items = [],
  cardType = 'featured',
  timer = 7000,
  fadeDuration = 500,
  className = "",
  label,
  label_color
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (items.length > 1) {
      timeoutRef.current = setTimeout(
        () =>
          setCurrentIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
          ),
        timer
      );
    }
    return () => {
      resetTimeout();
    };
  }, [currentIndex, items, timer]);

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(index);
  };

  const renderCard = (item, isFeatured) => {
    const cardContent = (
      <div className={`relative overflow-hidden group cursor-pointer shadow-lg h-full ${isFeatured ? 'rounded-2xl' : 'rounded-xl'}`}>
        <img
          src={item.backgroundImage}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${item.bgColor} opacity-90 group-hover:opacity-80 transition-opacity duration-300`} />
        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
          <div className="flex items-start justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${item.statusColor} backdrop-blur-md shadow-lg`}>
              {item.status}
            </span>
            <div className="flex space-x-1.5 z-20">
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
            <h3 className={`font-bold mb-2 leading-tight ${isFeatured ? 'text-2xl' : 'text-lg'}`}>
              {item.title}
            </h3>
            {isFeatured && (
              <p className="text-sm opacity-90 mb-3 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex items-center justify-between text-xs opacity-80">
              <span>{item.date}</span>
              {isFeatured && (
                 <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1"><Eye className="w-4 h-4" /><span>{item.views}</span></div>
                    <div className="flex items-center space-x-1"><Heart className="w-4 h-4" /><span>{item.likes}</span></div>
                    <div className="flex items-center space-x-1"><Share2 className="w-4 h-4" /><span>{item.shares}</span></div>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <Link href={item.url || '#'} className="block h-full">
        {cardContent}
      </Link>
    );
  };

  if (!items || items.length === 0) {
    return <div className={`relative h-full ${className} bg-gray-200 rounded-2xl`}></div>;
  }

  return (
    <div className={`relative h-full ${className}`}>
      {label && (
        <div className={`absolute top-2 left-3 ${label_color} text-white px-2 py-1 text-xs font-bold rounded z-10`}>
          {label}
        </div>
      )}
      <div className="relative h-full overflow-hidden">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-${fadeDuration} ease-in-out`}
            style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 10 : 1 }}
          >
            {renderCard(item, cardType === 'featured')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
