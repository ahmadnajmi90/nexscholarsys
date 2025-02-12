import React from 'react';
import { Link } from '@inertiajs/react';

const WelcomePosts = ({ posts }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative flex justify-center items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600">Latest Posts</h2>
          <Link
            href={route('login')}
            className="absolute right-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            See More
          </Link>
        </div>


        {/* Grid with exactly 5 columns */}
        <div className="grid grid-cols-5 gap-4">
          {posts.slice(0, 5).map(post => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-center pb-6"
            >
              <img
                src={post.image ? `/storage/${post.image}` : "/storage/default.jpg"}
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
              {/* Button container with mt-auto pushes it to the bottom */}
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
      </div>
    </section>
  );
};

export default WelcomePosts;
