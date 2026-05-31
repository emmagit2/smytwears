import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted aspect-square w-full" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-muted w-3/4" />
        <div className="h-4 bg-muted w-1/2" />
        <div className="h-3 bg-muted w-1/4" />
      </div>
    </div>
  );
}