import PropTypes from 'prop-types';

// Product card skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

// Category card skeleton
export const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="w-full h-32 bg-gray-200 rounded-md mb-4"></div>
    <div className="space-y-2">
      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
    </div>
  </div>
);

// Hero section skeleton
export const HeroSkeleton = () => (
  <div className="w-full h-screen relative overflow-hidden animate-pulse">
    <div className="flex h-full flex-col md:flex-row">
      <div className="w-full md:w-2/5 bg-gray-200 flex items-center px-6 md:px-10 py-12 md:py-0">
        <div className="w-full space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-12 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
      <div className="w-full md:w-3/5 bg-gray-300"></div>
    </div>
  </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Text skeleton
export const TextSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`h-4 bg-gray-200 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}></div>
    ))}
  </div>
);

// Button skeleton
export const ButtonSkeleton = ({ className = "" }) => (
  <div className={`h-10 bg-gray-200 rounded animate-pulse ${className}`}></div>
);

// Card skeleton
export const CardSkeleton = ({ className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse flex flex-col ${className}`}>
    <div className="w-full h-32 bg-gray-200 rounded-md mb-4"></div>
    <div className="space-y-2 flex-1">
      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="h-10 bg-gray-200 rounded mt-4"></div>
  </div>
);

// Plan card skeleton with fixed height
export const PlanCardSkeleton = ({ variant = "default", className = "" }) => {
  const getHeight = () => {
    switch (variant) {
      case 'compact':
        return 'h-[280px]';
      case 'detailed':
        return 'h-[480px]';
      default:
        return 'h-[420px]';
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'compact':
        return 'h-32';
      case 'detailed':
        return 'h-48';
      default:
        return 'h-44';
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col animate-pulse ${getHeight()} ${className}`}>
      {/* Image skeleton */}
      <div className={`w-full ${getImageHeight()} bg-gray-200 relative`}>
        <div className="absolute top-3 left-3 w-16 h-6 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        
        {/* Features skeleton */}
        <div className="flex-1 mt-3 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
          <div className="h-3 bg-gray-200 rounded w-3/5"></div>
        </div>
        
        {/* Actions skeleton */}
        <div className="flex items-center justify-between mt-4 flex-shrink-0">
          <div className="h-8 bg-gray-200 rounded-full flex-1"></div>
          <div className="flex gap-3 ml-3">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
};

TextSkeleton.propTypes = {
  lines: PropTypes.number,
  className: PropTypes.string,
};

ButtonSkeleton.propTypes = {
  className: PropTypes.string,
};

CardSkeleton.propTypes = {
  className: PropTypes.string,
};

PlanCardSkeleton.propTypes = {
  variant: PropTypes.oneOf(['default', 'compact', 'detailed']),
  className: PropTypes.string,
};

export default {
  ProductCardSkeleton,
  CategoryCardSkeleton,
  HeroSkeleton,
  TableSkeleton,
  TextSkeleton,
  ButtonSkeleton,
  CardSkeleton,
  PlanCardSkeleton
};
