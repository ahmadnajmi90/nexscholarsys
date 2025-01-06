import React, { useState, useEffect, useRef } from "react";
import { FaNewspaper, FaTh, FaStar, FaSearch } from "react-icons/fa";

const Dashboard_M = ({ events, users }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true); // State for controlling fade effect
    const touchStartRef = useRef(null); // Reference to store the start of a touch event
    const touchEndRef = useRef(null); // Reference to store the end of a touch event

  // Process the events data to generate carousel and card content
const eventData = events.map((event) => {
    return {
        id: event.id, // Ensure unique identifier for each event
        url: event.image
            ? `/storage/${event.image}` // Adjust based on your storage path
            : "https://via.placeholder.com/800x600", // Fallback image
        title: event.event_name || "Untitled Event",

        theme: event.event_theme || "No Theme", // Replace 'likes' with any relevant field
    };
});

    // Use Set to filter duplicates based on unique id and title
    const uniqueEventData = Array.from(
        new Map(eventData.map((item) => [item.id + item.title, item])).values()
    );

    // Limit the carousel data to 7 slides
    const limitedEventData = uniqueEventData.slice(0, 7);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fade-out
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % limitedEventData.length);
                setFade(true); // Start fade-in
            }, 300); // Wait for fade-out duration
        }, 7000); // Auto-slide every 7 seconds
        return () => clearInterval(interval);
    }, [limitedEventData.length]);

    const handleDotClick = (index) => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex(index);
            setFade(true);
        }, 300);
    };

    // Function to handle touch start
    const handleTouchStart = (e) => {
        touchStartRef.current = e.touches[0].clientX;
    };

    // Function to handle touch end
    const handleTouchEnd = (e) => {
        touchEndRef.current = e.changedTouches[0].clientX;
        handleSwipeGesture();
    };

    // Function to handle swipe gestures
    const handleSwipeGesture = () => {
        const swipeDistance = touchStartRef.current - touchEndRef.current;

        // Threshold to detect a valid swipe (e.g., 50px)
        if (swipeDistance > 50) {
            // Swipe left - move to the next slide
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % limitedEventData.length);
                setFade(true);
            }, 300);
        } else if (swipeDistance < -50) {
            // Swipe right - move to the previous slide
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === 0 ? limitedEventData.length - 1 : prevIndex - 1
                );
                setFade(true);
            }, 300);
        }
    };

    return (
        <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
            <div
                className="bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden relative flex flex-col"
                style={{ width: "414px", height: "736px", maxWidth: "100%", maxHeight: "100%" }}
            >
                <div
                    className="bg-white w-full px-5 pt-6 pb-20 overflow-y-auto h-full"
                    onTouchStart={handleTouchStart} // Attach touch start event
                    onTouchEnd={handleTouchEnd} // Attach touch end event
                >
                    {/* Today Section */}
                    <div className="mb-3">
                        <h1 className="text-3xl font-bold">Today</h1>
                        <p className="text-sm text-gray-500 uppercase font-bold">{new Date().toDateString()}</p>
                    </div>

                    {/* Carousel Section */}
                    <div className="mb-5 relative">
                        {limitedEventData.length > 0 && (
                            <a
                                href="#"
                                className={`block rounded-lg relative p-5 transform transition-opacity duration-500 ${
                                    fade ? "opacity-100" : "opacity-0"
                                }`}
                                style={{
                                    backgroundImage: `url(${limitedEventData[currentIndex].url})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="h-48"></div>
                                <h2 className="text-white text-2xl font-bold leading-tight mb-3 pr-5">
                                    {limitedEventData[currentIndex].title}
                                </h2>
                                <div className="flex w-full items-center text-sm text-gray-300 font-medium">
                                    <div className="flex-1 flex items-center">
                                        <div
                                            className="rounded-full w-8 h-8 mr-3"
                                            style={{
                                                backgroundImage: `url(https://via.placeholder.com/32)`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        ></div>
                                        <div>{limitedEventData[currentIndex].author}</div>
                                    </div>
                                    <div>{limitedEventData[currentIndex].theme}</div>
                                </div>
                            </a>
                        )}
                        {/* Pagination Dots */}
                        <div className="absolute bottom-2 right-2 flex space-x-2">
                            {limitedEventData.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`w-2 h-2 rounded-full ${
                                        index === currentIndex ? "bg-indigo-500" : "bg-gray-300"
                                    }`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation Bar */}
                <div className="bg-white fixed bottom-0 w-full border-t border-gray-200 flex">
                    <a
                        href="#"
                        className="flex flex-grow items-center justify-center p-2 text-indigo-500 hover:text-indigo-500"
                    >
                        <div className="text-center">
                            <FaNewspaper className="text-3xl" />
                            <span className="block text-xs leading-none">Today</span>
                        </div>
                    </a>
                    <a
                        href="#"
                        className="flex flex-grow items-center justify-center p-2 text-gray-500 hover:text-indigo-500"
                    >
                        <div className="text-center">
                            <FaTh className="text-3xl" />
                            <span className="block text-xs leading-none">Categories</span>
                        </div>
                    </a>
                    <a
                        href="#"
                        className="flex flex-grow items-center justify-center p-2 text-gray-500 hover:text-indigo-500"
                    >
                        <div className="text-center">
                            <FaStar className="text-3xl" />
                            <span className="block text-xs leading-none">Favorites</span>
                        </div>
                    </a>
                    <a
                        href="#"
                        className="flex flex-grow items-center justify-center p-2 text-gray-500 hover:text-indigo-500"
                    >
                        <div className="text-center">
                            <FaSearch className="text-3xl" />
                            <span className="block text-xs leading-none">Search</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard_M;
