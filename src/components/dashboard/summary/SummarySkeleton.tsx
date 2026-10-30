import { Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

export const SummarySkeleton = ({ columns = 3 }: { columns?: 2 | 3 }) => {
  const gridCols = columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, idx) => (
          <Skeleton key={idx} className="h-18 rounded-xl" />
        ))}
      </div>
      <div
        className={cn(
          "grid gap-4",
          columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {Array.from({ length: columns }, (_, idx) => (
          <Skeleton key={idx} className="h-48 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Skeleton className="h-96 rounded-xl lg:col-span-3" />
        <Skeleton className="h-96 rounded-xl lg:col-span-2" />
      </div>
      <div className={cn("grid gap-6", gridCols)}>
        {Array.from({ length: columns }, (_, idx) => (
          <Skeleton key={idx} className="h-80 rounded-xl" />
        ))}
      </div>
    </div>
  );
};
