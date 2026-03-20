"use client";

import clsx from "clsx";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui";
import { useTheme } from "@/context/ThemeProvider";
import { useIsClient } from "@/hooks";

export function ToggleThemeButton({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className={clsx("[&>svg]:size-5", className)}
    >
      {resolvedTheme === "dark" ? <Moon /> : <Sun />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
