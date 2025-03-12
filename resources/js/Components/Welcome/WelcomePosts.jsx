import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const WelcomePosts = ({ posts }) => {
  const totalPosts = posts.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalPosts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalPosts.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative flex justify-center items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600">Posts</h2>
          <Link
            href={route('posts.index')}
            className="absolute right-0 px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            See More
          </Link>
        </div>

        {/* Desktop View: Grid with 5 columns */}
        <div className="hidden md:grid md:grid-cols-5 gap-4">
          {totalPosts.map(post => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-center pb-6 h-96"
            >
              <img
                src={post.featured_image ? `/storage/${post.featured_image}` : "/storage/default.jpg"}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              {/* Content area grows to push the button to the bottom */}
              <div className="p-6 flex-grow">
                <h2
                  className="text-xl font-semibold text-gray-800 truncate"
                  title={post.title}
                >
                  {post.title}
                </h2>
                <p
                  className="text-gray-600 mt-4 text-center font-extralight"
                  style={{
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: post.content.replace(/<[^>]+>/g, '').substring(0, 100) + "..."
                  }}
                ></p>
              </div>
              {/* Button container */}
              <div className="px-4 mt-auto pb-4">
                <Link
                  href={route('welcome.posts.show', post.url)}
                  className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium transition hover:border-primary hover:bg-primary hover:text-dark"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Slider */}
        <div className="md:hidden relative">
          <div className="flex justify-center">
            <div
              key={totalPosts[currentIndex].id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-center pb-6 w-[21rem] h-[25rem] md:w-full md:h-full"
            >
              <img
                src={totalPosts[currentIndex].featured_image ? `/storage/${totalPosts[currentIndex].featured_image}` : "/storage/default.jpg"}
                alt={totalPosts[currentIndex].title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex-grow">
                <h2
                  className="text-xl font-semibold text-gray-800 truncate"
                  title={totalPosts[currentIndex].title}
                >
                  {totalPosts[currentIndex].title}
                </h2>
                <p
                  className="text-gray-600 mt-4 text-center font-extralight"
                  style={{
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: totalPosts[currentIndex].content.replace(/<[^>]+>/g, '').substring(0, 100) + "..."
                  }}
                ></p>
              </div>
              <div className="px-4 mt-auto pb-4">
                <Link
                  href={route('welcome.posts.show', totalPosts[currentIndex].url)}
                  className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium transition hover:border-primary hover:bg-primary hover:text-dark"
                >
                  View Details
                </Link>
              </div>
            </div>
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
};

export default WelcomePosts;
