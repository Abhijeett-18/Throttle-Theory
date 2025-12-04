import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-start animate-pulse">
      <div className="w-full aspect-[4/5] bg-gray-200 rounded-lg"></div>
      <div className="w-3/4 h-3 bg-gray-200 rounded mt-3"></div>
      <div className="w-1/3 h-4 bg-gray-200 rounded mt-2"></div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Image skeleton */}
      <div>
        <div className="w-full aspect-[4/5] bg-gray-200 rounded-2xl"></div>
        <div className="flex gap-3 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-16 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>

      {/* Details skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-12 h-10 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <div className="w-32 h-12 bg-gray-200 rounded-md"></div>
          <div className="flex-1 h-12 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
