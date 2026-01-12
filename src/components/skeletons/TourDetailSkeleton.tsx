import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/Layout";

export const TourDetailSkeleton = () => {
  return (
    <Layout>
      <div className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <Skeleton className="h-[400px] md:h-[500px] w-full rounded-2xl" />
              
              {/* Thumbnails */}
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-24 rounded-lg" />
                ))}
              </div>

              {/* Title & Meta */}
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="space-y-4">
                <div className="flex gap-4 border-b border-border pb-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 space-y-6">
                {/* Price */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-40" />
                </div>

                {/* Quick Info */}
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>

                {/* Share */}
                <div className="flex justify-center gap-3 pt-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
