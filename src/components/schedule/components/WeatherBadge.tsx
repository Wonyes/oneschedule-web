import { ProcessedWeather } from "@/src/types/schedule";
import { getWeatherIcon } from "@/src/utils/schedule";

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
      <span
        className={`inline-block animate-pulse rounded-full bg-muted/30 ${
          iconOnly ? "h-2.5 w-2.5" : "h-3.5 w-9"
        }`}
        aria-hidden="true"
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
