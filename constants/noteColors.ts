// utils/noteColors.ts
export const noteColors = [
  { name: "White", value: "#ffffff" },
  { name: "Yellow", value: "#fff9c4" },
  { name: "Orange", value: "#ffe0b2" },
  { name: "Pink", value: "#f8bbd0" },
  { name: "Purple", value: "#d1c4e9" },
  { name: "Blue", value: "#e1f5fe" },
  { name: "Cyan", value: "#b2ebf2" },
  { name: "Green", value: "#c8e6c9" },
  { name: "Lime", value: "#e6ee9c" },
  { name: "Coral", value: "#ffccbc" },
  { name: "Gray", value: "#e0e0e0" },
  { name: "Brown", value: "#d7ccc8" },
];

export const getContrastColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.6 ? "rgba(0,0,0,0.87)" : "rgba(255,255,255,0.95)";
};
