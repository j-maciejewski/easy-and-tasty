"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button, Separator, SidebarTrigger } from "@/components/ui";
import { Path } from "@/config";

import { Breadcrumbs } from "./Breadcrumbs";
import { ToggleThemeButton } from "./ToggleThemeButton";

export const Header = () => {
  return (
    <header className="bg-card shadow-sm">
      <div className="mx-auto flex items-center gap-2 px-4 py-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="text-foreground size-9" />
        <Separator orientation="vertical" className="mx-2 min-h-6" />
        <div className="mr-auto min-w-0">
          <Breadcrumbs />
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={Path.HOME} target="_blank" rel="noopener noreferrer">
            <ExternalLink />
            <span className="hidden sm:inline">View site</span>
          </Link>
        </Button>
        <ToggleThemeButton />
      </div>
    </header>
  );
};
