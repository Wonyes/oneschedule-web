import { ProcessedWeather } from "@/src/types/schedule";
import { getWeatherIcon } from "@/src/utils/schedule";

type WeatherProps = {
  targetWeather?: ProcessedWeather[string];
  iconOnly?: boolean;
};

export default function WeatherBadge({
  targetWeather,
  iconOnly = false,
}: WeatherProps) {
  if (!targetWeather) return null;

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
