export const CATEGORIES = [
  "Food", "Travel", "Shopping", "Bills",
  "Education", "Health", "Entertainment", "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#f97316",
  Travel: "#10b981",
  Shopping: "#6366f1",
  Bills: "#f59e0b",
  Education: "#fb923c",
  Health: "#a855f7",
  Entertainment: "#22c55e",
  Other: "#64748b",
};
