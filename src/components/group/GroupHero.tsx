import { Copy, Crown, Settings } from "lucide-react";
import BaseCard from "../ui/card/BaseCard";
import { Row, Column, Between } from "../ui/layout/flex";

export const GroupHero = ({ group }) => {
  return (
    <BaseCard
      glow
      className="
          p-7
        "
    >
      <Between>
        <Column>
          <Row className="gap-3">
            <h1 className="text-2xl font-bold text-white">{group.groupName}</h1>

            {group.groupRole === "SUPER" && (
              <Row
                className="
                    gap-1
                    rounded-full
                    bg-yellow-400/10
                    px-3
                    py-1
                  "
              >
                <Crown size={13} className="text-yellow-400" />

                <span
                  className="
                      typo-caption-2
                      text-yellow-400
                    "
                >
                  관리자
                </span>
              </Row>
            )}
          </Row>

          <p
            className="
                mt-3
                typo-sub-t-3
                text-slate-400
              "
          >
            함께 일정을 관리하는 그룹입니다.
          </p>

          <Row className="mt-6 gap-3">
            <span
              className="
                  typo-caption-2
                  text-slate-500
                "
            >
              초대 코드
            </span>

            <Row
              className="
                  gap-2
                  rounded-xl
                  bg-slate-800
                  px-4
                  py-2
                "
            >
              <span
                className="
                    typo-sub-t-3
                    text-slate-200
                  "
              >
                {group.groupCode}
              </span>

              <button
                className="
                    text-slate-400
                    transition
                    hover:text-white
                  "
              >
                <Copy size={15} />
              </button>
            </Row>
          </Row>
        </Column>

        <button
          className="
              rounded-xl
              border
              border-slate-700
              p-3
              text-slate-400
              transition
              hover:bg-slate-800
            "
        >
          <Settings size={20} />
        </button>
      </Between>
    </BaseCard>
  );
};
