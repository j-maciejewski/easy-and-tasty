const MAX_TILES = 5;

export function getPaginationTiles(currentPage: number, totalPages: number) {
  const result: Array<number | null> = [];

  if (totalPages <= MAX_TILES) {
    for (let i = 1; i <= totalPages; i++) {
      result.push(i);
    }
    return result;
  }

  result.push(1);

  if (currentPage > 3) {
    result.push(null);
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  if (currentPage < totalPages - 2) {
    result.push(null);
  }

  result.push(totalPages);

  return result;
}
