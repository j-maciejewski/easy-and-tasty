import { GaugeHigh, GaugeLow, GaugeMedium } from "@/components/icons";

export const getDifficultyIcon = (difficulty: "easy" | "medium" | "hard") => {
  switch (difficulty) {
    case "easy":
      return <GaugeLow className="w-5 text-green-600" />;

    case "medium":
      return <GaugeMedium className="w-5 text-yellow-600" />;

    case "hard":
      return <GaugeHigh className="w-5 text-red-600" />;
  }
};
