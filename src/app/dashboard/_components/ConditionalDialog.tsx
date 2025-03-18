import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import Link from "next/link";

namespace ConditionalDialog {
  export interface Props {
    title: string;
    trigger: React.ReactNode;
    content: React.ReactNode;
    showDialog: boolean;
    dialogRef: React.RefObject<HTMLButtonElement | null>;
    link: string;
  }
}

export const ConditionalDialog = ({
  trigger,
  title,
  content,
  showDialog,
  dialogRef,
  link,
}: ConditionalDialog.Props) => {
  if (!showDialog) return <Link href={link}>{trigger}</Link>;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[calc(100%_-_4rem)] overflow-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
        <DialogClose ref={dialogRef} />
      </DialogContent>
    </Dialog>
  );
};
