import { ProcessedWeather } from "@/src/types/schedule";
import Skeleton from "../../ui/Skeleton";
import WeatherIcon from "./WeatherIcon";

type WeatherProps = {
  targetWeather?: ProcessedWeather[string];
  iconOnly?: boolean;
  isLoading?: boolean;
};

export default function WeatherBadge({
  targetWeather,
  iconOnly = false,
  isLoading = false,
}: WeatherProps) {
  if (!targetWeather) {
    if (!isLoading) return null;

    return (
      <Skeleton
        className={`inline-block rounded-full ${iconOnly ? "h-2.5 w-2.5" : "h-3.5 w-9"}`}
      />
    );
  }

  if (iconOnly) {
    return (
      <WeatherIcon pty={targetWeather.PTY} sky={targetWeather.SKY} size={10} />
    );
  }

  return (
    <span className="inline-flex items-center gap-1 leading-none">
      <WeatherIcon pty={targetWeather.PTY} sky={targetWeather.SKY} size={13} />
      <span className="typo-caption-2 tabular-nums leading-none text-muted">
        {targetWeather.TMP}°
      </span>
    </span>
  );
}
