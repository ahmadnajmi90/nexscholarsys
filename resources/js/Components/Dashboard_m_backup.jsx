import React, { useState, useEffect } from "react";
import { FaNewspaper, FaTh, FaStar, FaSearch } from "react-icons/fa";

const Dashboard_M = ({ events, users }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true); // State for controlling fade effect

    // Process the events data to generate carousel and card content
    const eventData = events.map((event) => {
        const author = users.find((user) => user.unique_id === event.author_id)?.name || "Unknown Author";
        return {
            url: event.image
                ? `/storage/${event.image}` // Adjust based on your storage path
                : "https://via.placeholder.com/800x600", // Fallback image
            title: event.event_name || "Untitled Event",
            author: author,
            theme: event.event_theme || "No Theme", // Replace 'likes' with any relevant field
        };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fade-out
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % eventData.length);
                setFade(true); // Start fade-in
            }, 300); // Wait for fade-out duration
        }, 3000); // Auto-slide every 3 seconds
        return () => clearInterval(interval);
    }, [eventData.length]);

    const handleDotClick = (index) => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex(index);
            setFade(true);
        }, 300);
    };

    return (
        <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
            <div
                className="bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden relative flex flex-col"
                style={{ width: "414px", height: "736px", maxWidth: "100%", maxHeight: "100%" }}
            >
                <div className="bg-white w-full px-5 pt-6 pb-20 overflow-y-auto h-full">
                    {/* Today Section */}
                    <div className="mb-3">
                        <h1 className="text-3xl font-bold">Today</h1>
                        <p className="text-sm text-gray-500 uppercase font-bold">{new Date().toDateString()}</p>
                    </div>

                    {/* Carousel Section */}
                    <div className="mb-5 relative">
                        {eventData.length > 0 && (
                            <a
                                href="#"
                                className={`block rounded-lg relative p-5 transform transition-opacity duration-500 ${
                                    fade ? "opacity-100" : "opacity-0"
                                }`}
                                style={{
                                    backgroundImage: `url(${eventData[currentIndex].url})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="h-48"></div>
                                <h2 className="text-white text-2xl font-bold leading-tight mb-3 pr-5">
                                    {eventData[currentIndex].title}
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
                                        <div>{eventData[currentIndex].author}</div>
                                    </div>
                                    <div>{eventData[currentIndex].theme}</div>
                                </div>
                            </a>
                        )}
                        {/* Pagination Dots */}
                        <div className="absolute bottom-2 right-2 flex space-x-2">
                            {eventData.map((_, index) => (
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

                    {/* Other cards */}
                    {/* {eventData.map((event, index) => (
                        <div key={index} className="mb-5">
                            <a
                                href="#"
                                className="block rounded-lg relative p-5 transform transition-all duration-300 scale-100 hover:scale-95"
                                style={{
                                    background: `url(${event.url}) center`,
                                    backgroundSize: "cover",
                                }}
                            >
                                <div className="h-48"></div>
                                <h2 className="text-white text-2xl font-bold leading-tight mb-3 pr-5">
                                    {event.title}
                                </h2>
                                <div className="flex w-full items-center text-sm text-gray-300 font-medium">
                                    <div className="flex-1 flex items-center">
                                        <div
                                            className="rounded-full w-8 h-8 mr-3"
                                            style={{
                                                background: "url(https://via.placeholder.com/32) center",
                                                backgroundSize: "cover",
                                            }}
                                        ></div>
                                        <div>{event.author}</div>
                                    </div>
                                    <div>{event.theme}</div>
                                </div>
                            </a>
                        </div>
                    ))} */}
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
