import React from "react";
import { FaNewspaper, FaTh, FaStar, FaSearch } from "react-icons/fa";

const Dashboard_M = () => {
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
          {/* First Card */}
          <div className="mb-5">
            <a
              href="#"
              className="block rounded-lg relative p-5 transform transition-all duration-300 scale-100 hover:scale-95"
              style={{
                background: "url(https://images.unsplash.com/photo-1484876065684-b683cf17d276?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80) center",
                backgroundSize: "cover",
              }}
            >
              <div className="absolute top-0 right-0 -mt-3 mr-3">
                <div className="rounded-full bg-indigo-500 text-white text-xs py-1 pl-2 pr-3 leading-none">
                  <span className="align-middle">FRESH</span>
                </div>
              </div>
              <div className="h-48"></div>
              <h2 className="text-white text-2xl font-bold leading-tight mb-3 pr-5">
                Tasnim Lacey New Album Out Now
              </h2>
              <div className="flex w-full items-center text-sm text-gray-300 font-medium">
                <div className="flex-1 flex items-center">
                  <div
                    className="rounded-full w-8 h-8 mr-3"
                    style={{
                      background: "url(https://randomuser.me/api/portraits/women/74.jpg) center",
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <div>Gwen Thomson</div>
                </div>
                <div>18</div>
              </div>
            </a>
          </div>
          {/* Other cards (repeat similar structure) */}
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
