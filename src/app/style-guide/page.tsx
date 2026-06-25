import {
  Ghost,
  Primary,
  Secondary,
  WhiteGhost,
} from "@/src/components/common/Button";
import { Labels } from "@/src/components/common/Labels";

export default function StyleGuide() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 p-4">
        <Primary text="Button" />
        <Secondary text="Button" />
        <Ghost text="Button" />
        <WhiteGhost text="Button" />
      </div>
      <div className="flex gap-4 p-4">
        <Labels text="Overdue" />
        <Labels text="Due Today" color="yellow" />
        <Labels text="Primary" color="primary" />
        <Labels text="Mint" color="mint" />
      </div>
    </div>
  );
}
