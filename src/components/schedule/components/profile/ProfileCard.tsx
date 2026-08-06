import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column } from "@/src/components/ui/layout/flex";
import { MyInfoResponse } from "@/src/hooks/querys/useMembers";

export default function ProfileCard({ user }: { user: MyInfoResponse }) {
  return (
    <BaseCard className="p-8" glow>
      <Column className="items-center text-center">
        <h1 className="typo-h4 text-slate-100">{user.nickname}</h1>

        <p className="mt-1 typo-sub-t-2 text-slate-400">{user.name}</p>
      </Column>
    </BaseCard>
  );
}
