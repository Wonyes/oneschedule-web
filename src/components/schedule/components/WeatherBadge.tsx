import { ProcessedWeather } from "@/src/types/schedule";
import { getWeatherIcon } from "@/src/utils/schedule";

type WeatherProps = {
  targetWeather?: ProcessedWeather[string];
};

export default function WeatherBadge({ targetWeather }: WeatherProps) {
  if (!targetWeather) return null;

  return (
    <div>
      <span>{getWeatherIcon(targetWeather.PTY, targetWeather.SKY)}</span>
      <span className="text-[12px] text-muted">{targetWeather.TMP}°</span>
    </div>
  );
}
