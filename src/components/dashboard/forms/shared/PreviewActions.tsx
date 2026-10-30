"use client";

import { Eye, Link2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { api } from "@/trpc/react";

export type PreviewTarget = {
  type: "recipe" | "article";
  id: number;
};

interface PreviewActionsProps extends PreviewTarget {
  isDirty: boolean;
}

export const PreviewActions = ({ type, id, isDirty }: PreviewActionsProps) => {
  const recipeLink = api.authorized.recipe.getPreviewLink.useQuery(
    { id },
    { enabled: type === "recipe" },
  );
  const articleLink = api.authorized.article.getPreviewLink.useQuery(
    { id },
    { enabled: type === "article" },
  );
  const url = (type === "recipe" ? recipeLink : articleLink).data?.url;

  const handleCopy = async () => {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(
        new URL(url, window.location.origin).href,
      );
      toast.success("Preview link copied", {
        description: "Anyone with the link can view it for 7 days.",
      });
    } catch {
      toast.error("Couldn't copy the preview link");
    }
  };

  const previewButton = url ? (
    <Button asChild variant="outline" size="sm">
      <a href={url} target="_blank" rel="noopener">
        <Eye />
        Preview
      </a>
    </Button>
  ) : (
    <Button variant="outline" size="sm" disabled>
      <Eye />
      Preview
    </Button>
  );

  return (
    <>
      {isDirty ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{previewButton}</span>
          </TooltipTrigger>
          <TooltipContent>Save to preview your latest changes</TooltipContent>
        </Tooltip>
      ) : (
        previewButton
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!url}
        onClick={handleCopy}
      >
        <Link2 />
        Copy preview link
      </Button>
    </>
  );
};
