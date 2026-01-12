import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => {
  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background */}
      <Skeleton className="absolute inset-0 rounded-none" />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 px-4 max-w-3xl">
          {/* Badge */}
          <Skeleton className="h-8 w-40 mx-auto rounded-full" />
          
          {/* Title */}
          <Skeleton className="h-12 md:h-16 w-full max-w-xl mx-auto" />
          <Skeleton className="h-12 md:h-16 w-3/4 mx-auto" />
          
          {/* Description */}
          <Skeleton className="h-5 w-full max-w-lg mx-auto" />
          <Skeleton className="h-5 w-2/3 mx-auto" />
          
          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-36 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
