import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import useRoles from '../../Hooks/useRoles';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Index = () => {
  const { postProjects, search } = usePage().props;
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const [searchTerm, setSearchTerm] = useState(search || '');

  let debounceTimeout;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      const form = document.getElementById('search-form');
      form.submit();
    }, 300);
  };

  return (
    <MainLayout title="">
      {/* Center content and add padding */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Your Projects</h1>
          <Link
            href={route('post-projects.create')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add New Project
          </Link>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <form id="search-form" method="GET" action={route('post-projects.index')}>
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search projects..."
              className="border rounded-lg px-4 py-2 w-full"
            />
          </form>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md p-4">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Date of Published</th>
                <th className="py-2 px-4 border-b">Statistics</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {postProjects.data.map(project => (
                <tr key={project.id} className="border-b">
                  <td className="py-2 px-4 font-semibold text-center">{project.title}</td>
                  <td className="py-2 px-4 text-center">{project.category}</td>
                  <td className="py-2 px-4 text-center">{formatDate(project.created_at)}</td>
                  <td className="py-2 px-4 text-center">{project.sponsored_by}</td>
                  <td className="py-2 px-4 text-center">
                    <Link
                      href={route('post-projects.edit', project.id)}
                      title="Edit"
                      className="inline-block mr-2"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center rounded">
                        <PencilIcon className="w-5 h-5" />
                      </div>
                    </Link>
                    <Link
                      href={route('post-projects.destroy', project.id)}
                      method="delete"
                      as="button"
                      title="Delete"
                      className="inline-block"
                    >
                      <div className="w-8 h-8 bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center rounded">
                        <TrashIcon className="w-5 h-5" />
                      </div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Card List */}
        <div className="md:hidden">
          {postProjects.data.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">{project.title}</h2>
              <p className="text-sm text-gray-500">Category: {project.category}</p>
              <p className="text-sm text-gray-500">Published: {formatDate(project.created_at)}</p>
              <p className="text-sm text-gray-500">Statistics: {project.sponsored_by}</p>
              <div className="mt-2 flex space-x-4">
                <Link
                  href={route('post-projects.edit', project.id)}
                  title="Edit"
                  className="inline-block"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center rounded">
                    <PencilIcon className="w-5 h-5" />
                  </div>
                </Link>
                <Link
                  href={route('post-projects.destroy', project.id)}
                  method="delete"
                  as="button"
                  title="Delete"
                  className="inline-block"
                >
                  <div className="w-8 h-8 bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center rounded">
                    <TrashIcon className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Links */}
        <div className="mt-4 flex justify-center">
          {postProjects.links.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className={`mx-1 px-4 py-2 rounded ${
                link.active
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
