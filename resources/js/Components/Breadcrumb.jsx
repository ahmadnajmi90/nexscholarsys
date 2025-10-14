import React from 'react';
import { Link } from '@inertiajs/react';
import { FaChevronRight } from 'react-icons/fa';

const Breadcrumb = ({ links }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      {links.map((link, index) => (
        <React.Fragment key={index}>
          {index > 0 && <FaChevronRight className="w-3 h-3 text-gray-400" />}
          {link.url ? (
            <Link href={link.url} className="transition-colors duration-200 hover:text-gray-900">
              {link.title}
            </Link>
          ) : (
            <span className="font-semibold text-gray-700">{link.title}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
