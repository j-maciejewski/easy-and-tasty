"use client";

import { useState } from "react";

export const useModalAction = <T>() => {
  const [action, setAction] = useState<T | null>(null);

  const clearAction = () => setAction(null);

  return { action, setAction, clearAction };
};
