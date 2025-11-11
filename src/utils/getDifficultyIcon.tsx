import { GaugeHigh, GaugeLow, GaugeMedium } from "@/components/icons";

export const getDifficultyIcon = (difficulty: "easy" | "medium" | "hard") => {
  switch (difficulty) {
    case "easy":
      return <GaugeLow className="text-green-600" />;

    case "medium":
      return <GaugeMedium className="text-yellow-600" />;

    case "hard":
      return <GaugeHigh className="text-red-600" />;
  }
};
