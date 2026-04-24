import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
            <div className="w-48 h-6 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(350px,auto)]">
          {/* Main Area Skeleton */}
          <div className="lg:col-span-2 row-span-2 rounded-2xl border bg-card p-6">
            <div className="w-48 h-6 bg-muted rounded mb-4 animate-pulse"></div>
            <div className="w-full h-full min-h-[300px] bg-muted/50 rounded-xl animate-pulse"></div>
          </div>

          {/* Side Area Skeletons */}
          {[1, 2].map(i => (
            <div key={i} className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="w-32 h-6 bg-muted rounded mb-6 animate-pulse"></div>
              {[1, 2, 3].map(j => (
                <div key={j} className="flex gap-4">
                  <div className="w-12 h-12 bg-muted rounded-xl animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
                    <div className="w-2/3 h-3 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LoadingSkeleton;
