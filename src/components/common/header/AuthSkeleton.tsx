import Skeleton from "../../ui/Skeleton";

export default function AuthSkeleton() {
  return (
    <div className="flex items-center gap-1.5">
      {/* HeaderAuth의 아바타 버튼(p-1 lg:px-2.5 lg:py-1.5 + IconBox sm 원형 + 닉네임)과 같은 크기 */}
      <div className="flex items-center gap-2 p-1 lg:px-2.5 lg:py-1.5">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="hidden h-3 w-12 lg:block" />
      </div>

      {/* 로그아웃 아이콘 버튼과 같은 크기 */}
      <Skeleton className="h-7 w-7 rounded-xl" />
    </div>
  );
}
