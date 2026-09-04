import { ProcessedWeather } from "@/src/types/schedule";
import { getWeatherIcon } from "@/src/utils/schedule";
import Skeleton from "../../ui/Skeleton";

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
      <span className="text-[10px] leading-none">
        {getWeatherIcon(targetWeather.PTY, targetWeather.SKY)}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-0.5 leading-none">
      <span className="leading-none">
        {getWeatherIcon(targetWeather.PTY, targetWeather.SKY)}
      </span>
      <span className="typo-caption-1 text-muted leading-none">
        {targetWeather.TMP}°
      </span>
    </div>
  );
}
