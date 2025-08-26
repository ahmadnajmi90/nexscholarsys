import React from 'react';
import { DivideIcon as LucideIcon, Clock, User, Tag } from 'lucide-react';

interface ProductCardProps {
  title: string;
  subtitle: string;
  description: string;
  status: string;
  date: string;
  author: string;
  readTime: string;
  type: string;
  category: string;
  bgColor: string;
  statusColor: string;
  backgroundImage: string;
  icon: LucideIcon;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  title, 
  subtitle, 
  description,
  status, 
  date,
  author,
  readTime,
  type, 
  category,
  bgColor, 
  statusColor, 
  backgroundImage, 
  icon: IconComponent,
  compact = false
}) => {
  if (compact) {
    return (
      <article className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100">
        <div className="flex">
          {/* Compact Image */}
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-80`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Compact Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase tracking-wider">
                {type}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor}`}>
                {status}
              </span>
            </div>
            
            <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
              {title}
            </h3>
            
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              {description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-medium">{author}</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100">
      {/* Hero Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${bgColor} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
        
        {/* Top Meta Info */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white border-opacity-30">
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-white bg-white bg-opacity-20 backdrop-blur-md px-3 py-1 rounded-full border border-white border-opacity-30 uppercase tracking-wider">
              {type}
            </span>
          </div>
          
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor} backdrop-blur-md shadow-lg`}>
            {status}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center space-x-1 text-xs font-medium text-white bg-black bg-opacity-30 backdrop-blur-md px-3 py-1 rounded-full border border-white border-opacity-20">
            <Tag className="w-3 h-3" />
            <span>{category}</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title & Subtitle */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-600 font-medium mb-2 leading-relaxed">
            {subtitle}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>

        {/* Date & Action */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">{date}</span>
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full">
            {type === 'news' ? 'Read More' : 
             type === 'event' ? 'View Details' :
             type === 'grant' ? 'Apply Now' : 'View Project'}
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
    </article>
  );
};

export default ProductCard;