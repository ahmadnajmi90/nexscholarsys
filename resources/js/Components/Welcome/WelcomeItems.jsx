import React, { useState } from 'react';
import ItemCard from './ItemCard';
import { Link } from '@inertiajs/react';

export default function WelcomeItems({ items, auth, title, type }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = items.slice(0, 5); // Only use the first 5 items

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative flex justify-center items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600">{title}</h2>
          <Link
            href={
              type === "event"
                ? route("events.index")
                : type === "project"
                ? route("projects.index")
                : route("grants.index")
            }
            className="absolute right-0 px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            See More
          </Link>
        </div>

        {/* Desktop View: Grid with 5 columns */}
        <div className="hidden md:grid md:grid-cols-5 gap-4">
          {totalItems.map(item => (
            <ItemCard key={item.id} item={item} auth={auth} type={type} />
          ))}
        </div>

        {/* Mobile View: Slider */}
        <div className="md:hidden relative">
          <div className="flex justify-center">
            <ItemCard
              item={totalItems[currentIndex]}
              auth={auth}
              type={type}
            />
          </div>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl"
          >
            &gt;
          </button>

        </div>
      </div>
    </section>
  );
}
