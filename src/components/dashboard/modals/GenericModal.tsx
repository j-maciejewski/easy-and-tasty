import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

export namespace GenericModal {
  export interface Props {
    title: string;
    content: React.ReactNode;
    open: boolean;
    handleClose: () => void;
    className?: string;
  }
}

export const GenericModal = ({
  title,
  content,
  open,
  handleClose,
  className,
}: GenericModal.Props) => {
  const isControlled = open !== undefined;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
      defaultOpen={isControlled ? undefined : true}
    >
      <DialogContent
        className={
          className ?? "max-h-[calc(100%-4rem)] overflow-auto sm:max-w-md"
        }
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};
