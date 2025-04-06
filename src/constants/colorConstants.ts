// Define supported color themes
export type ColorTheme = "emerald" | "sky" | "yellow";

// Define theme color mappings
export const themeColors: Record<ColorTheme, {
    bg: string;
    border: string;
    text: string;
    selectedBorder: string;
  }> = {
    emerald: {
      bg: "bg-emerald-100",
      border: "border-emerald-200",
      text: "text-emerald-600",
      selectedBorder: "border-emerald-400"
    },
    sky: {
      bg: "bg-sky-100",
      border: "border-sky-200",
      text: "text-sky-600",
      selectedBorder: "border-sky-400"
    },
    yellow: {
        bg: "bg-yellow-100",
        border: "border-yellow-200",
        text: "text-yellow-600",
        selectedBorder: "border-yellow-400"
    }
};