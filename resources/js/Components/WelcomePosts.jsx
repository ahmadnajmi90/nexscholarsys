import React from 'react';
import { Link } from '@inertiajs/react';

const WelcomePosts = ({ posts }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          Latest Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-4">
                {post.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
              </p>
              <div className="text-center">
                <Link
                  href={route('welcome.posts.show', post.url)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={route('login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View More Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WelcomePosts;
