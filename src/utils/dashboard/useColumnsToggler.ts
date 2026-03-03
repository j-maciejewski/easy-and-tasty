"use client";

import { useState } from "react";

export const useColumnsToggler = <T extends string>(
  defaultHiddenColumns: T[] = [],
) => {
  const [hiddenColumns, setHiddenColumns] = useState<T[]>(defaultHiddenColumns);

  const toggleColumn = (toggledColumn: T) => {
    setHiddenColumns((prev) => {
      if (prev.includes(toggledColumn)) {
        return prev.filter((column) => column !== toggledColumn);
      }
      return [...prev, toggledColumn];
    });
  };

  return { hiddenColumns, toggleColumn };
};
