"use client";

import { Printer } from "lucide-react";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

interface PrintButtonProps {
  type: "recipe" | "article";
}

export const PrintButton = ({ type }: PrintButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        className="size-9"
        aria-label={`Print ${type}`}
        onClick={() => window.print()}
      >
        <Printer className="absolute size-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Print {type}</TooltipContent>
  </Tooltip>
);
