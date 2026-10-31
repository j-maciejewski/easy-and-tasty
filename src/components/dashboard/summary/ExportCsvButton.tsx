"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { api } from "@/trpc/react";

const ranges = [7, 30, 90] as const;

export const ExportCsvButton = ({
  entityType,
}: {
  entityType: "recipe" | "article";
}) => {
  const exportCsv = api.authorized.analytics.exportCsv.useMutation({
    onSuccess: (csv, { days }) => {
      const url = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `${entityType}-stats-${days}d-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exportCsv.isPending}>
          <Download />
          Export CSV
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ranges.map((days) => (
          <DropdownMenuItem
            key={days}
            onClick={() => exportCsv.mutate({ entityType, days })}
          >
            Last {days} days
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
