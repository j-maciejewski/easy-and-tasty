"use client";

import { useState } from "react";

export const useRowSelection = <K extends React.Key = number>(
  resetDeps: unknown[],
) => {
  const resetKey = JSON.stringify(resetDeps);
  const [selection, setSelection] = useState<{ resetKey: string; keys: K[] }>({
    resetKey,
    keys: [],
  });

  const selectedKeys = selection.resetKey === resetKey ? selection.keys : [];

  const setSelectedKeys = (keys: K[]) => setSelection({ resetKey, keys });
  const clearSelection = () => setSelection({ resetKey, keys: [] });

  return { selectedKeys, setSelectedKeys, clearSelection };
};
