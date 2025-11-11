import { Pencil } from "lucide-react";

import { EditSeoForm } from "@/components/dashboard";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { seo, staticPageTypeEnum } from "@/server/db/schema";

export namespace SeoSection {
  export interface Props {
    label: string;
    type: (typeof staticPageTypeEnum.enumValues)[number];
    data?: Omit<typeof seo.$inferSelect, "pageType">;
  }
}

export const SeoSection = ({ label, type, data }: SeoSection.Props) => {
  return (
    <Dialog>
      <div className="space-y-3">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-semibold text-xl">{label}</h2>
          <DialogTrigger asChild>
            <Button variant="ghost" className="size-6">
              <Pencil className="size-4" />
            </Button>
          </DialogTrigger>
        </div>
        <div className="space-y-2">
          <h6 className="font-semibold text-base">Title</h6>
          {data?.title ? (
            <p className="text-foreground/75 text-sm">{data.title}</p>
          ) : (
            <p className="text-foreground/75 text-sm italic">No title</p>
          )}
        </div>
        <div className="space-y-2">
          <h6 className="font-semibold text-base">Description</h6>
          {data?.description ? (
            <p className="text-foreground/75 text-sm">{data.description}</p>
          ) : (
            <p className="text-foreground/75 text-sm italic">No description</p>
          )}
        </div>
        <div className="space-y-2">
          <h6 className="font-semibold text-base">Image</h6>
          {data?.image ? (
            // biome-ignore lint/performance/noImgElement: explanation
            <img src={data.image} alt={data.title} className="max-w-[400px]" />
          ) : (
            <p className="text-foreground/75 text-sm italic">No image</p>
          )}
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {label}?</DialogTitle>
          </DialogHeader>

          <EditSeoForm data={data} pageType={type} />
        </DialogContent>
      </div>
    </Dialog>
  );
};
