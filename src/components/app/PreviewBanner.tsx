import { Eye } from "lucide-react";

import { Button } from "@/components/ui";

interface PreviewBannerProps {
  type: "recipe" | "article";
  isPublished: boolean;
  path: string;
}

export const PreviewBanner = ({
  type,
  isPublished,
  path,
}: PreviewBannerProps) => (
  <div
    role="status"
    className="bg-foreground text-background fixed inset-x-0 bottom-0 z-50 border-t"
  >
    <div className="width-content mx-auto flex items-center justify-between gap-4 px-4 py-3 text-sm">
      <p className="flex items-center gap-2 font-medium">
        <Eye className="size-4 shrink-0" />
        {isPublished ? "Preview" : `Preview — this ${type} is not published`}
      </p>
      <form action="/api/preview" method="post">
        <input type="hidden" name="path" value={path} />
        <Button type="submit" size="sm" variant="secondary">
          Exit preview
        </Button>
      </form>
    </div>
  </div>
);
