import React, { useState, useEffect, useRef } from "react";

const Dashboard_M = ({ events, users }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true); // State for controlling fade effect
    const touchStartRef = useRef(null); // Reference to store the start of a touch event
    const touchEndRef = useRef(null); // Reference to store the end of a touch event

    const eventData = events.map((event) => {
        const author = users.find((user) => user.unique_id === event.author_id)?.name || "Unknown Author";
        return {
            id: event.id,
            url:  `/storage/${event.image}`,
            title: event.event_name || "Untitled Event",
            author: author,
            theme: event.event_theme || "No Theme",
        };
    });

    const uniqueEventData = Array.from(
        new Map(eventData.map((item) => [item.id + item.title, item])).values()
    );

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
                        {limitedEventData.length > 0 && (
                            <a
                                href="#"
                                className={`block rounded-lg relative p-5 transform transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
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
                                        {/* <div
                                            className="rounded-full w-8 h-8 mr-3"
                                            style={{
                                                backgroundImage: `url(https://via.placeholder.com/32)`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        ></div> */}
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
                                    className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-indigo-500" : "bg-gray-300"
                                        }`}
                                ></button>
                            ))}
                        </div>
                    </div>

                    {/* Other cards */}
                    {events.map((event, index) => (
                            <div key={index} className="mb-5">
                                <a
                                    href="#"
                                    className="block rounded-lg relative p-5 transform transition-all duration-300 scale-100 hover:scale-95"
                                    style={{
                                        background: `url(${
                                            event.image
                                                ? `/storage/${event.image}`
                                                : "https://via.placeholder.com/800x600"
                                        }) center`,
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <div className="h-48"></div>
                                    <h2 className="text-white text-2xl font-bold leading-tight mb-3 pr-5">
                                        {event.event_name || "Untitled Event"}
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
                                            <div>{  users.find((user) => user.unique_id === event.author_id)?.name || "Unknown Author"}</div>
                                        </div>
                                        <div>{event.event_theme || "No Theme"}</div>
                                    </div>
                                </a>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard_M;
