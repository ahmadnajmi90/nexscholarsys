import React from 'react';

export default function SettingsCard({ 
  id, 
  title, 
  description, 
  children, 
  className = '' 
}) {
  return (
    <section 
      id={id}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 transition-shadow hover:shadow-md ${className}`}
    >
      {title && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

