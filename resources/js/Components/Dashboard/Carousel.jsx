import React, { useState, useEffect, useRef } from "react";

const Carousel = ({
  items = [],
  timer = 7000,
  renderItem,
  fadeDuration = 300,
  className = "",
  label, // Optional label prop
  seoPrefix = "/events/", // Default prefix; adjust as needed
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
  const handleDotClick = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, fadeDuration);
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

  // Click handler for navigating to an item's SEO-friendly link.
  const handleItemClick = () => {
    const currentItem = items[currentIndex];
    if (currentItem && currentItem.url) {
      // The url attribute stored in the database is just the last part.
      // Prepend the appropriate prefix (for example, '/events/') to form the full URL.
      window.location.href = `${seoPrefix}${currentItem.url}`;
    }
  };

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
      {/* Optional Label at Top Right */}
      {label && (
        <div className="absolute top-2 right-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded z-50">
          {label}
        </div>
      )}
      {items.length > 0 && (
        <>
          {/* Render the current slide with fade animation and clickable wrapper */}
          <div
            onClick={handleItemClick}
            className={`cursor-pointer transform h-full transition-opacity duration-${fadeDuration} ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {renderItem(items[currentIndex], currentIndex)}
          </div>
          {/* Pagination Dots */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-indigo-500" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
