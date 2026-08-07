import BaseCard from "../ui/card/BaseCard";
import { Row, Column, Between } from "../ui/layout/flex";
import { Crown, Users } from "lucide-react";

export default function GroupMemberSection({ members }) {
  return (
    <BaseCard
      className="
            flex-1
            p-6
            h-[520px]
          "
      glow
    >
      <Row className="mb-6 gap-2">
        <Users size={18} />

        <h2 className="typo-title-2 text-white">그룹 멤버</h2>
      </Row>

      <Column
        className="
              h-[430px]
              gap-4
              overflow-y-auto
              pr-2
            "
      >
        {members.map((member) => (
          <Between
            key={member.memberNo}
            className="
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900/40
                  px-5
                  py-4
                  w-full
                  neu-pressed
                "
          >
            <Row className="gap-4">
              <Row
                className="
                      h-11
                      w-11
                      justify-center
                      rounded-full
                      bg-blue-500/10
                      font-bold
                      text-blue-400
                    "
              >
                {member.nickname[0]}
              </Row>

              <Column>
                <Row className="gap-2">
                  <span className="typo-sub-t-2 text-white">
                    {member.nickname}
                  </span>

                  {member.groupRole === "SUPER" && (
                    <Crown size={14} className="text-yellow-400" />
                  )}
                </Row>

                <span
                  className="
                        mt-1
                        typo-caption-2
                        text-slate-500
                      "
                >
                  {member.position}
                </span>
              </Column>
            </Row>

            <span
              className="
                    rounded-full
                    bg-slate-800
                    px-3
                    py-1
                    typo-caption-2
                    text-slate-300
                  "
            >
              {member.groupRole}
            </span>
          </Between>
        ))}
      </Column>
    </BaseCard>
  );
}
