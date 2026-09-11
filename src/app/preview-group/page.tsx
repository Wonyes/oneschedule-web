"use client";

import GroupDashboard from "@/src/components/group/GroupDashboard";
import { MyGroupResponse } from "@/src/types/group";

const members = Array.from({ length: 7 }, (_, i) => ({
  memberNo: i + 1,
  nickname: ["wontwo", "wony", "김서준", "이하은", "박민준", "최지우", "정우진"][i],
  email: `m${i}@a.com`,
  message: null,
  groupRole: (i === 0 ? "SUPER" : i === 1 ? "SUB" : "MEMBER") as "SUPER" | "SUB" | "MEMBER",
  position: ["왕", "부왕", "", "디자인", "", "개발", ""][i],
}));

const group: MyGroupResponse = {
  groupNo: 11,
  groupName: "wony house",
  groupCode: "WNY-4K2P",
  groupRole: "SUPER",
  position: "왕",
  visibility: "PUBLIC_APPROVAL",
  description: "주말마다 모여서 밥 먹고 게임하는 집. 일정 겹치면 여기서 맞춰요.",
  members,
};

export default function Page() {
  return (
    <div className="mx-auto max-w-[1100px] p-4">
      <GroupDashboard group={group} />
    </div>
  );
}
