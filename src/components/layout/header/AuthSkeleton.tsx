import Skeleton from "../../ui/Skeleton";

export default function AuthSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="hidden h-3 w-12 min-[1360px]:block" />
      </div>

      <Skeleton className="hidden h-9 w-9 rounded-xl lg:block" />
    </div>
  );
}
