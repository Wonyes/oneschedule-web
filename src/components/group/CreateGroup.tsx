import { useForm } from "@/src/hooks/useForm";
import { GhostBtn, Primary } from "../ui/layout/button";
import { Input } from "../ui/layout/input";
import BaseCard from "../ui/card/BaseCard";
import { ArrowLeft } from "lucide-react";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { Post } from "@/src/hooks/querys/useMutations";
import { useOverlay } from "@/src/hooks/useOverlay";
import { useQueryClient } from "@tanstack/react-query";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { memberskeys } from "@/src/hooks/querys/key/members";

export default function CreateGroup({ onBack }: { onBack: () => void }) {
  const queryClient = useQueryClient();
  const { openToast } = useOverlay();
  const { form, formChange } = useForm({
    groupName: "",
    position: "",
  });

  const { mutate: createGroup } = useAppMutation({
    mutationFn: () => {
      return Post({
        url: "group/create",
        params: {
          groupName: form.groupName,
          position: form.position,
        },
      });
    },
    onSuccess: () => {
      openToast({
        message: "그룹이 생성되었습니다.",
      });

      queryClient.invalidateQueries({
        queryKey: [memberskeys.myInfo],
      });

      queryClient.invalidateQueries({
        queryKey: [groupkeys.myGroup],
      });
    },
    onError: (err) => {
      openToast({
        message: getErrorMessage(err, "그룹 생성에 실패했습니다."),
      });
    },
  });

  const handleCreateGroup = () => {
    if (form.groupName.length < 0) {
      return alert("그룹 이름을 입력해주세요.");
    } else if (form.position.length < 0) {
      return alert("내 직책을 입력해주세요.");
    }

    createGroup();
  };

  return (
    <BaseCard className="w-full px-6 py-8" glow>
      <GhostBtn
        text="돌아가기"
        icon={<ArrowLeft size={14} />}
        onClick={onBack}
      />

      <div className="mb-10 mt-4">
        <span className="text-indigo-400 typo-title-2 font-medium">GROUP</span>

        <h1 className="mt-2 typo-title-1 text-foreground">새 그룹 만들기</h1>

        <p className="mt-3 typo-sub-t-2 text-muted leading-relaxed">
          그룹을 생성하고 친구들과 일정을 공유해보세요.
          <br />
          생성 후 초대 코드를 발급받을 수 있습니다.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 typo-sub-t-3 text-muted">
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
          <label className="block mb-2 typo-sub-t-3 text-muted">
            내 직책
          </label>

          <Input
            placeholder="예) 프론트엔드"
            name="position"
            value={form.position}
            onChange={formChange}
          />
        </div>

        <div className="rounded-2xl bg-back border border-divider p-4">
          <p className="typo-sub-t-3 text-muted">
            그룹 생성 후 초대 코드가 자동으로 발급됩니다.
          </p>
        </div>

        <Primary
          text="그룹 생성"
          className="w-full typo-sub-t-1"
          onClick={handleCreateGroup}
        />
      </div>
    </BaseCard>
  );
}
