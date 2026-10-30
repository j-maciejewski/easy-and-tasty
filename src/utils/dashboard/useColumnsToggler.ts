"use client";

import { useEffect, useState } from "react";

const getStorageKey = (key: string) => `dashboard:hidden-columns:${key}`;

export const useColumnsToggler = <T extends string>(
  defaultHiddenColumns: T[] = [],
  storageKey?: string,
) => {
  const [hiddenColumns, setHiddenColumns] = useState<T[]>(defaultHiddenColumns);

  useEffect(() => {
    if (!storageKey) return;

    try {
      const stored = localStorage.getItem(getStorageKey(storageKey));
      if (!stored) return;

      const parsed: unknown = JSON.parse(stored);
      if (
        Array.isArray(parsed) &&
        parsed.every((value) => typeof value === "string")
      ) {
        setHiddenColumns(parsed as T[]);
      }
    } catch {}
  }, [storageKey]);

  const toggleColumn = (toggledColumn: T) => {
    const next = hiddenColumns.includes(toggledColumn)
      ? hiddenColumns.filter((column) => column !== toggledColumn)
      : [...hiddenColumns, toggledColumn];

    setHiddenColumns(next);

    if (storageKey) {
      try {
        localStorage.setItem(getStorageKey(storageKey), JSON.stringify(next));
      } catch {}
    }
  };

  return { hiddenColumns, toggleColumn };
};
