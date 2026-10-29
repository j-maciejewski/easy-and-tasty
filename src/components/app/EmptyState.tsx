import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: { label: string; href: string };
}

export const EmptyState = ({
  title,
  description,
  icon: Icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className="bg-card flex flex-col items-start rounded-3xl p-8 md:p-12">
      {Icon && (
        <span className="bg-accent text-basil mb-5 flex size-12 items-center justify-center rounded-full">
          <Icon className="size-6" aria-hidden />
        </span>
      )}
      <p className="font-display text-2xl font-semibold tracking-tight">
        {title}
      </p>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-md">{description}</p>
      )}
      {action && (
        <Button asChild size="lg" className="mt-6 rounded-full px-6">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
};
