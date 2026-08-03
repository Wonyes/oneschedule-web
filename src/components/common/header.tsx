import Logo from "./header/Logo";
import HeaderTabs from "./header/HeaderTabs";
import HeaderAuth from "./header/HeaderAuth";
import { getMyInfo } from "@/src/lib/member";
import ViewModeToggle from "./header/ViewModeToggle";

export default async function Header() {
  const user = await getMyInfo();
  console.log("HEADER USER", user);
  return (
    <header className="grid grid-cols-3 items-center px-4 py-3 shrink-0">
      <Logo />
      <HeaderTabs />

      <div className="flex items-center gap-3 justify-end">
        <ViewModeToggle />

        <HeaderAuth user={user} />
      </div>
    </header>
  );
}
