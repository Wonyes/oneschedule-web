import { Search, MapPin, MenuIcon } from "lucide-react";
import ThemeToggle from "./common/DarkToggle";

export default function Header() {
  return (
    <header className="flex items-center pb-8 justify-between">
      <div className="flex gap-4 items-center">
        <MenuIcon size={24} />
        <h1 className="text-2xl font-bold">Constructor</h1>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3" />

          <input
            className="
            pl-10
            h-10
            rounded-xl
            bg-gray-100
            outline-none
            px-4
            "
            placeholder="Search..."
          />
        </div>

        <button className="flex gap-2 items-center">
          <MapPin size={16} />
          Korea, Seoul
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
