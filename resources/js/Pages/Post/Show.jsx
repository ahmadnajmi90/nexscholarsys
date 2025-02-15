import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FaArrowLeft } from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';

export default function Show() {
  // Get post, previous/next posts, and lists from Inertia props.
  const { post, previous, next, academicians, postgraduates, undergraduates } = usePage().props;
  const { isAcademician, isPostgraduate, isUndergraduate } = useRoles();

  // Determine the author based on the post's author_id.
  const author =
    (isAcademician && academicians && academicians.find(a => a.academician_id === post.author_id)) ||
    (isPostgraduate && postgraduates && postgraduates.find(p => p.postgraduate_id === post.author_id)) ||
    (isUndergraduate && undergraduates && undergraduates.find(u => u.undergraduate_id === post.author_id)) ||
    null;

  return (
    <MainLayout>
      {/* Back arrow */}
      <div className="absolute top-[5.5rem] left-[18.5rem] z-50">
        <Link 
          href={route('posts.index')}
          className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
          <FaArrowLeft className="text-xl" />
        </Link>
      </div>

      <div className="px-16">
        <div className="max-w-8xl mx-auto py-6">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 text-left">{post.title}</h1>

          {/* Author Info Section */}
          {author ? (
              <div className="flex items-center gap-4 mb-4">
                  <img 
                      src={`/storage/${author.profile_picture}`} 
                      alt={author.full_name} 
                      className="w-12 h-12 rounded-full object-cover shadow-md bg-gray-200 border-2 border-white"
                  />
                  <div>
                      <div className="text-lg font-semibold">{author.full_name}</div>
                      <div className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                  </div>
              </div>
          ) : (
              <p className="text-left text-gray-500 mb-4">Author not found</p>
          )}

          {/* Banner */}
          {post.featured_image && (
            <div
              className="w-full h-64 bg-cover bg-center mb-4"
              style={{ backgroundImage: `url(/storage/${post.featured_image})` }}
            />
          )}

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

          {/* Gallery */}
          {post.images && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {JSON.parse(post.images).map((img, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={`/storage/${img}`}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-3xl mx-auto p-6 flex justify-between">
          {previous ? (
            <Link href={route('posts.show', previous.url)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Previous
            </Link>
          ) : (
            <span></span>
          )}
          {next ? (
            <Link href={route('posts.show', next.url)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Next
            </Link>
          ) : (
            <span></span>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
