export function createMap<T extends { id: T["id"] }>(data: Array<T>) {
  return new Map(data.map((item) => [item.id, item]));
}
