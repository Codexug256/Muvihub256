
import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="px-5 pt-24 space-y-10">
      <div className="w-full h-[400px] skeleton rounded-3xl"></div>
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-6">
          <div className="w-48 h-8 skeleton rounded-lg"></div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map(j => (
              <div key={j} className="w-[140px] h-[260px] skeleton rounded-2xl flex-none"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
