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
    <div className="flex flex-col items-start rounded-3xl bg-card p-8 md:p-12">
      {Icon && (
        <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-accent text-basil">
          <Icon className="size-6" aria-hidden />
        </span>
      )}
      <p className="font-display font-semibold text-2xl tracking-tight">
        {title}
      </p>
      {description && (
        <p className="mt-2 max-w-md text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button asChild size="lg" className="mt-6 rounded-full px-6">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
};
