import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FaArrowLeft } from 'react-icons/fa';

export default function Show() {
  // Receive current post, previous, and next posts via Inertia props.
  const { post, previous, next } = usePage().props;

  return (
    <MainLayout>
      {/* Back arrow positioned at top left with high z-index */}
      <div className="absolute top-30 left-[18.5rem] z-50">
        <Link 
            href={route('posts.index')}
            className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
            <FaArrowLeft className="text-2xl" />
        </Link>
    </div>


      {/* Main content wrapper with top padding to prevent overlap with the back arrow */}
      <div className="px-16">
        {/* Banner: Use post image as background if available */}
        {post.image && (
          <div
            className="w-full h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(/storage/${post.image})` }}
          />
        )}

        {/* Post details container */}
        <div className="max-w-8xl mx-auto py-6">
          <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>

          {/* Content */}
          <div
            className="mb-4 text-gray-700 text-justify"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Category */}
          <p className="mb-2">
            <span className="font-semibold">Category:</span> {post.category}
          </p>
          
          {/* Tags */}
          <p className="mb-2">
            <span className="font-semibold">Tags:</span>{" "}
            {Array.isArray(post.tags) ? post.tags.join(', ') : post.tags}
          </p>

          {/* Attachment */}
          {post.attachment && (
            <p className="mb-2">
              <span className="font-semibold">Attachment:</span>
              <a
                href={`/storage/${post.attachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 underline"
              >
                View Attachment
              </a>
            </p>
          )}
        </div>

        {/* Navigation Buttons: Previous and Next */}
        <div className="max-w-3xl mx-auto p-6 flex justify-between">
            {previous ? (
            <Link href={route('posts.show', previous.url)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</Link>
            ) : (<span></span>)}
            {next ? (
            <Link href={route('posts.show', next.url)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next</Link>
            ) : (<span></span>)}
        </div>
      </div>
    </MainLayout>
  );
}
