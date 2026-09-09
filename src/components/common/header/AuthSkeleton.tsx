import Skeleton from "../../ui/Skeleton";

export default function AuthSkeleton() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-2 p-1 lg:px-2.5 lg:py-1.5">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="hidden h-3 w-12 lg:block" />
      </div>

      <Skeleton className="h-7 w-7 rounded-xl" />
    </div>
  );
}
