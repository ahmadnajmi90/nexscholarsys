import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { FaEye, FaHeart, FaShareAlt } from 'react-icons/fa';
import { Head } from '@inertiajs/react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Index = () => {
  const { fundingItems, isPostgraduate, search, isUndergraduate, isFacultyAdmin, type } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(search || '');
  const [activeTab, setActiveTab] = useState(type || 'grants');

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

  const handleTabChange = (newType) => {
    setActiveTab(newType);
    router.get(route('funding.admin.index', { type: newType }), {}, {
      preserveState: false,
      preserveScroll: false
    });
  };

  return (
    <MainLayout title="">
      <Head title={`Your ${activeTab === 'grants' ? 'Grants' : 'Scholarships'}`} />
      {/* Wrap everything in a centered container */}
      <div className="max-w-8xl mx-auto px-4 py-20 md:py-20 lg:py-4">
        <div className="flex justify-between items-center my-4">
          <h1 className="text-2xl font-semibold">Your Funding</h1>
          <Link
            href={route('funding.admin.create', { type: activeTab === 'grants' ? 'grant' : 'scholarship' })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add New {activeTab === 'grants' ? 'Grant' : 'Scholarship'}
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('grants')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'grants'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Grants
              </button>
              <button
                onClick={() => handleTabChange('scholarships')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'scholarships'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Scholarships
              </button>
            </nav>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="mb-4">
          <form id="search-form" method="GET" action={route('funding.admin.index', { type: activeTab })}>
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={`Search ${activeTab === 'grants' ? 'grants' : 'scholarships'}...`}
              className="border rounded-lg px-4 py-2 w-full"
            />
          </form>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto bg-white shadow-md">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border-b text-left w-2/5">Title</th>
                <th className="py-2 px-4 border-b w-3/20 text-left">Category</th>
                <th className="py-2 px-4 border-b w-3/20">Date of Published</th>
                <th className="py-2 px-4 border-b w-1/5">Statistics</th>
                <th className="py-2 px-4 border-b w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fundingItems.data.map(item => (
                <tr key={item.id} className="border-b py-2 hover:bg-gray-50">
                  <td className="py-2 px-4 font-semibold text-left max-w-sm truncate">{item.title}</td>
                  <td className="py-2 px-4 text-left">{item.scholarship_type || item.grant_type}</td>
                  <td className="py-2 px-4 text-center">{formatDate(item.created_at)}</td>
                  <td className="py-2 px-4 text-center">
                      <div className="flex justify-center space-x-2 items-center">
                          <div className="flex items-center">
                          <FaEye className="w-5 h-5 text-gray-600" />
                          <span className="ml-1">{item.total_views}</span>
                          </div>
                          <div className="flex items-center">
                          <FaHeart className="w-5 h-5 text-red-600" />
                          <span className="ml-1">{item.total_likes}</span>
                          </div>
                          <div className="flex items-center">
                          <FaShareAlt className="w-5 h-5 text-blue-600" />
                          <span className="ml-1">{item.total_shares}</span>
                          </div>
                      </div>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <Link
                      href={route('funding.admin.edit', { id: item.id, type: activeTab })}
                      title="Edit"
                      className="inline-block mr-2"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center rounded">
                        <PencilIcon className="w-5 h-5" />
                      </div>
                    </Link>
                    <Link
                      href={route('funding.admin.destroy', { id: item.id, type: activeTab })}
                      method="delete"
                      as="button"
                      title="Delete"
                      onClick={(e) => {
                        if (!window.confirm(`Are you sure you want to delete this ${activeTab === 'grants' ? 'grant' : 'scholarship'}?`)) {
                          e.preventDefault();
                        }
                      }}
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
          {fundingItems.data.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-500">Category: {item.scholarship_type || item.grant_type}</p>
              <p className="text-sm text-gray-500">Published: {formatDate(item.created_at)}</p>

              {/* Combined row for statistics and action buttons */}
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-500 flex items-center space-x-2">
                  <span>Statistics:</span>
                  <span className="flex items-center">
                    <FaEye className="w-4 h-4 mr-1" /> {item.total_views}
                  </span>
                  <span className="flex items-center">
                    <FaHeart className="w-4 h-4 mr-1 text-red-600" /> {item.total_likes}
                  </span>
                  <span className="flex items-center">
                    <FaShareAlt className="w-4 h-4 mr-1" /> {item.total_shares}
                  </span>
                </p>

                <div className="flex space-x-4">
                  <Link
                    href={route('funding.admin.edit', { id: item.id, type: activeTab })}
                    title="Edit"
                    className="inline-block"
                  >
                    <div className="w-8 h-8 bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center rounded">
                      <PencilIcon className="w-5 h-5" />
                    </div>
                  </Link>
                  <Link
                    href={route('funding.admin.destroy', { id: item.id, type: activeTab })}
                    method="delete"
                    as="button"
                    title="Delete"
                    onClick={(e) => {
                      if (!window.confirm(`Are you sure you want to delete this ${activeTab === 'grants' ? 'grant' : 'scholarship'}?`)) {
                        e.preventDefault();
                      }
                    }}
                    className="inline-block"
                  >
                    <div className="w-8 h-8 bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center rounded">
                      <TrashIcon className="w-5 h-5" />
                    </div>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>


        {/* Pagination Links */}
        <div className="mt-8 flex justify-center">
          {fundingItems.links.map((link, index) => (
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
