"use client";

import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui";
import { useIsClient } from "@/hooks";

export function ToggleThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={clsx("[&>svg]:size-5", className)}
    >
      {theme === "dark" ? <Moon /> : <Sun />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
