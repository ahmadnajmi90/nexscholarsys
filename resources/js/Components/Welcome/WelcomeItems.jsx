import React from 'react';
import ItemCard from './ItemCard';

export default function WelcomeItems({ items, auth, title, type }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative flex justify-center items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600">{title}</h2>
            <button
                href={route('login')}
                className="absolute right-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                See More
            </button>
        </div>

        {/* Grid with exactly 5 columns in one row */}
        <div className="grid grid-cols-5 gap-4">
          {items.slice(0, 5).map(item => (
            <ItemCard key={item.id} item={item} auth={auth} type={type} />
          ))}
        </div>
      </div>
    </section>
  );
}
