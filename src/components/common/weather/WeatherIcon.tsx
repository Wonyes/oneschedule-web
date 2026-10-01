import {
  Cloud,
  CloudDrizzle,
  CloudHail,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
} from "lucide-react";

import { getWeatherKind, WeatherKind } from "@/src/utils/schedule";
import { cn } from "@/src/utils/cn";

const ICONS: Record<
  WeatherKind,
  { icon: typeof Sun; className: string; label: string }
> = {
  sun: { icon: Sun, className: "text-pending-500", label: "맑음" },
  partly: { icon: CloudSun, className: "text-pending-500", label: "구름 조금" },
  cloud: { icon: Cloud, className: "text-muted", label: "흐림" },
  rain: { icon: CloudRain, className: "text-blue", label: "비" },
  shower: { icon: CloudDrizzle, className: "text-blue", label: "소나기" },
  sleet: { icon: CloudHail, className: "text-blue", label: "진눈깨비" },
  snow: { icon: Snowflake, className: "text-blue", label: "눈" },
};

export default function WeatherIcon({
  pty,
  sky,
  size = 14,
  className,
}: {
  pty: string;
  sky: string;
  size?: number;
  className?: string;
}) {
  const kind = getWeatherKind(pty, sky);
  if (!kind) return null;

  const { icon: Icon, className: tone, label } = ICONS[kind];

  return (
    <Icon
      size={size}
      strokeWidth={1.75}
      aria-label={label}
      className={cn("shrink-0", tone, className)}
    />
  );
}
