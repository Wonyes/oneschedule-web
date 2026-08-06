import { useForm } from "@/src/hooks/useForm";
import { GhostBtn, Primary } from "../ui/layout/button";
import { Input } from "../ui/layout/input";
import BaseCard from "../ui/card/BaseCard";
import { ArrowLeft } from "lucide-react";

export default function CreateGroup({ onBack }: { onBack: () => void }) {
  const { form, formChange } = useForm({
    groupName: "",
    position: "",
  });

  return (
    <BaseCard className="w-full px-6 py-8" glow>
      <GhostBtn
        text="돌아가기"
        icon={<ArrowLeft size={14} />}
        onClick={onBack}
      />

      <div className="mb-10 mt-4">
        <span className="text-indigo-400 typo-title-2 font-medium">GROUP</span>

        <h1 className="mt-2 typo-title-1 text-white">새 그룹 만들기</h1>

        <p className="mt-3 typo-sub-t-2 text-slate-400 leading-relaxed">
          그룹을 생성하고 친구들과 일정을 공유해보세요.
          <br />
          생성 후 초대 코드를 발급받을 수 있습니다.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 typo-sub-t-3 text-slate-400">
            그룹 이름
          </label>

          <Input
            placeholder="예) 여행 계획"
            name="groupName"
            value={form.groupName}
            onChange={formChange}
          />
        </div>

        <div>
          <label className="block mb-2 typo-sub-t-3 text-slate-400">
            내 직책
          </label>

          <Input
            placeholder="예) 프론트엔드"
            name="position"
            value={form.position}
            onChange={formChange}
          />
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <p className="typo-sub-t-3 text-slate-400">
            그룹 생성 후 초대 코드가 자동으로 발급됩니다.
          </p>
        </div>

        <Primary
          text="그룹 생성"
          className="
            w-full
            h-14
            rounded-2xl
            bg-indigo-600
            typo-sub-t-1
            hover:bg-indigo-500
            transition
          "
        />
      </div>
    </BaseCard>
  );
}
