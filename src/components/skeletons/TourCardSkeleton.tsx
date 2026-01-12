import { Skeleton } from "@/components/ui/skeleton";

export const TourCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="h-52 w-full rounded-none" />
      
      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Meta info */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Price section */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const TourGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <TourCardSkeleton key={index} />
      ))}
    </div>
  );
};
