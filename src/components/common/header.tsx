import HeaderTabs from "./header/HeaderTabs";
import ViewModeToggle from "./header/ViewModeToggle";
import HeaderAuth from "./header/HeaderAuth";
import { cookies } from "next/headers";
import Logo from "./header/Logo";

export default async function Header() {
  const cookieStore = await cookies();

  const hasToken = !!cookieStore.get("access-token")?.value;

  return (
    <header className="grid grid-cols-3 items-center px-4 py-3 shrink-0">
      {/* Logo */}
      <Logo />

      {/* Tabs */}
      <HeaderTabs />

      {/* Right */}
      <div className="flex items-center gap-3 justify-end">
        <ViewModeToggle />

        <HeaderAuth hasToken={hasToken} />
      </div>
    </header>
  );
}
