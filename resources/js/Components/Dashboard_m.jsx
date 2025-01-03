import React, { useState, useEffect } from "react";
import { FaNewspaper, FaTh, FaStar, FaSearch } from "react-icons/fa";

const Dashboard_M = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true); // State for controlling fade effect
  const images = [
    {
      url: "https://images.unsplash.com/photo-1484876065684-b683cf17d276?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
      title: "Tasnim Lacey New Album Out Now",
      author: "Gwen Thomson",
      likes: 18,
    },
    {
      url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1649&q=80",
      title: "Top 5 Cocktail Bars in NYC",
      author: "Kayden Buckley",
      likes: 7,
    },
    {
      url: "https://images.unsplash.com/photo-1526661934280-676cef25bc9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      title: "Best Travel Destinations",
      author: "Rowena Wheeler",
      likes: 12,
    },
    {
      url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      title: "Latest Fashion Trends",
      author: "Jack Ryan",
      likes: 15,
    },
    {
      url: "https://images.unsplash.com/photo-1558365849-6ebd8b0454b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      title: "Amazing Nature Spots",
      author: "Kevin Jackson",
      likes: 20,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true); // Start fade-in
      }, 300); // Wait for fade-out duration
    }, 3000); // Auto-slide every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

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
            <p className="text-sm text-gray-500 uppercase font-bold">THURSDAY 6 AUGUST</p>
          </div>
         {/* Carousel Section */}
          <div className="mb-5 relative">
            <a
              href="#"
              className={`block rounded-lg relative p-5 transform transition-opacity duration-500 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${images[currentIndex].url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="h-48"></div>
              <h2 className="text-white text-2xl font-bold leading-tight mb-3 pr-5">
                {images[currentIndex].title}
              </h2>
              <div className="flex w-full items-center text-sm text-gray-300 font-medium">
                <div className="flex-1 flex items-center">
                  <div
                    className="rounded-full w-8 h-8 mr-3"
                    style={{
                      backgroundImage: `url(https://randomuser.me/api/portraits/men/32.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div>{images[currentIndex].author}</div>
                </div>
                <div>{images[currentIndex].likes}</div>
              </div>
            </a>
            {/* Pagination Dots */}
            <div className="absolute bottom-2 right-2 flex space-x-2">
              {images.map((_, index) => (
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
          <div className="mb-5">
            <a
              href="#"
              className="block rounded-lg relative p-5 transform transition-all duration-300 scale-100 hover:scale-95"
              style={{
                background: "url(https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1649&q=80) center",
                backgroundSize: "cover",
              }}
            >
              <div className="h-48"></div>
              <h2 className="text-white text-2xl font-bold leading-tight mb-3 pr-5">
                Top 5 Cocktail Bars in NYC
              </h2>
              <div className="flex w-full items-center text-sm text-gray-300 font-medium">
                <div className="flex-1 flex items-center">
                  <div
                    className="rounded-full w-8 h-8 mr-3"
                    style={{
                      background: "url(https://randomuser.me/api/portraits/women/55.jpg) center",
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <div>Kayden Buckley</div>
                </div>
                <div>7</div>
              </div>
            </a>
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
