export function searchItems<T>(
  items: T[],
  keys: (keyof T)[],
  searchTerm: string,
): T[] {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowerCaseSearchTerm);
      }
      return false;
    }),
  );
}
