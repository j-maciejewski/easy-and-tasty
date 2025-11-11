import {
  DialogClose,
  DialogContent,
  DialogHeader,
  Dialog as DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";

export namespace Dialog {
  export interface Props {
    title: string;
    trigger: React.ReactNode;
    content: React.ReactNode;
    dialogRef: React.RefObject<HTMLButtonElement | null>;
  }
}

export const Dialog = ({
  trigger,
  title,
  content,
  dialogRef,
}: Dialog.Props) => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[calc(100%_-_4rem)] overflow-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
        <DialogClose ref={dialogRef} />
      </DialogContent>
    </DialogRoot>
  );
};
