export function latLngToGrid(lat: number, lng: number) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lng * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}

export type WeatherKind =
  "rain" | "sleet" | "snow" | "shower" | "sun" | "partly" | "cloud";

/** 기상청 단기예보의 강수형태(PTY)·하늘상태(SKY) 코드를 아이콘 종류로 바꾼다. */
export const getWeatherKind = (
  pty: string,
  sky: string,
): WeatherKind | null => {
  const rain: Record<string, WeatherKind> = {
    "1": "rain",
    "2": "sleet",
    "3": "snow",
    "4": "shower",
  };

  if (pty !== "0") return rain[pty] ?? null;

  const skyKinds: Record<string, WeatherKind> = {
    "1": "sun",
    "3": "partly",
    "4": "cloud",
  };

  return skyKinds[sky] ?? null;
};
