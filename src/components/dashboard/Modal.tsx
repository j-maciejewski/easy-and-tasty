import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";

export namespace Modal {
  export interface Props {
    title: string;
    trigger: React.ReactNode;
    content: React.ReactNode;
    dialogRef: React.RefObject<HTMLButtonElement | null>;
  }
}

export const Modal = ({ trigger, title, content, dialogRef }: Modal.Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[calc(100%-4rem)] overflow-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
        <DialogClose ref={dialogRef} />
      </DialogContent>
    </Dialog>
  );
};
