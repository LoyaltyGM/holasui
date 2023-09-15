import { create } from "zustand";

type BgColors = "basicColor" | "purpleColor" | "pinkColor" | "orangeColor";

interface IJourneyStore {
  bgColor: BgColors;
  isJourneyColor: boolean;
  setBgColor: (color: BgColors) => void;
  setDefaultBgColor: () => void;
}

export const useJourneyStore = create<IJourneyStore>()((set) => ({
  bgColor: "basicColor",
  isJourneyColor: false,
  setBgColor: (color) => set({ bgColor: color, isJourneyColor: true }),
  setDefaultBgColor: () => set({ bgColor: "basicColor", isJourneyColor: false }),
}));
