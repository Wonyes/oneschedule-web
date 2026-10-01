import { create } from "zustand";

interface WeatherStore {
  nx: number;
  ny: number;
  name?: string;

  setLocation: (name: string, nx: number, ny: number) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  name: "서울",
  nx: 60,
  ny: 127,

  setLocation: (name, nx, ny) => set({ name, nx, ny }),
}));
