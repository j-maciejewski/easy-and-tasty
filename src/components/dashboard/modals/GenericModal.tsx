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
  }
}

export const GenericModal = ({
  title,
  content,
  open,
  handleClose,
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
      <DialogContent className="max-h-[calc(100%-4rem)] overflow-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};
