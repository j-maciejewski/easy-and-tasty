export function sortItems<T>(
  items: T[],
  sortKey: keyof T,
  sortDir: "asc" | "desc" = "asc",
): T[] {
  if (items.length <= 1) return items;

  const firstItemValue = items?.[0]?.[sortKey];

  if (!firstItemValue) return items;

  const sortType = typeof firstItemValue === "number" ? "number" : "string";

  if (sortType === "number") {
    items.sort((a, b) => {
      const aValue = a[sortKey] as number;
      const bValue = b[sortKey] as number;

      return sortDir === "asc" ? aValue - bValue : bValue - aValue;
    });
  } else {
    items.sort((a, b) => {
      const aValue = (a[sortKey] as string).toUpperCase();
      const bValue = (b[sortKey] as string).toUpperCase();

      if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDir === "asc" ? 1 : -1;

      return 0;
    });
  }

  return items;
}
