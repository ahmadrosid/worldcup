const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-gray-300/60 dark:bg-gray-700/60 ${className}`} aria-hidden="true" />
);

const NextMatchCardSkeleton = () => (
  <li className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100/60 dark:bg-[#85858520] p-4">
    <Skeleton className="h-4 w-36 mx-auto" />
    <Skeleton className="h-3 w-56 max-w-full mx-auto mt-2" />
    <div className="flex items-center justify-between gap-4 mt-4">
      <div className="flex flex-col items-center gap-2 flex-1">
        <Skeleton className="h-10 w-14 sm:h-12 sm:w-16 rounded-md" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-3 w-6 rounded-full" />
      <div className="flex flex-col items-center gap-2 flex-1">
        <Skeleton className="h-10 w-14 sm:h-12 sm:w-16 rounded-md" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  </li>
);

const TimelineItemSkeleton = () => (
  <li className="flex gap-2">
    <div className="py-[4px]">
      <Skeleton className="w-[9px] h-[9px] rounded-full" />
      <div className="h-full py-[8px] px-[4px]">
        <Skeleton className="w-[2px] h-full min-h-[48px] rounded-none" />
      </div>
    </div>
    <div className="w-full space-y-2 pb-2 pt-1">
      <div className="flex justify-between gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="flex justify-between items-center gap-4">
        <Skeleton className="h-5 w-48 max-w-[70%]" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-4 w-56 max-w-full" />
    </div>
  </li>
);

export default function LoadingSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen h-full px-4 py-8 sm:p-16">
      <div>
        <div className="text-center my-4 space-y-3">
          <Skeleton className="h-12 sm:h-14 w-72 max-w-full mx-auto" />
          <Skeleton className="h-5 w-96 max-w-full mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>

        <div className="max-w-[650px] mx-auto my-8">
          <div className="border border-dashed border-gray-300 dark:border-gray-500 bg-gray-100/80 dark:bg-[#85858536] p-4 sm:p-6 rounded-lg shadow-sm">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-4 pt-4 items-center justify-between">
              <div className="space-y-2 flex flex-col items-center">
                <Skeleton className="h-12 w-16 sm:h-16 sm:w-20 rounded-md" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="text-center space-y-2 flex flex-col items-center">
                <Skeleton className="h-10 sm:h-16 w-28 sm:w-36" />
                <Skeleton className="h-4 w-14" />
              </div>
              <div className="space-y-2 flex flex-col items-center">
                <Skeleton className="h-12 w-16 sm:h-16 sm:w-20 rounded-md" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 max-w-[650px] mx-auto">
          <Skeleton className="h-10 w-44" />
          <ul className="py-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <NextMatchCardSkeleton key={`next-${index}`} />
            ))}
          </ul>
        </div>

        <div className="my-8 max-w-[650px] mx-auto">
          <Skeleton className="h-10 w-52" />
          <ul className="py-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <TimelineItemSkeleton key={`completed-${index}`} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
