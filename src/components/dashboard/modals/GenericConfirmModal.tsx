import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";

export namespace GenericConfirmModal {
  export interface Props {
    title: string;
    description?: string;
    open: boolean;
    closeText?: string;
    confirmText?: string;
    handleClose: () => void;
    handleConfirm: () => void;
  }
}

export const GenericConfirmModal = ({
  title,
  description,
  open,
  handleClose,
  handleConfirm,
  closeText = "Cancel",
  confirmText = "Confirm",
}: GenericConfirmModal.Props) => {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
      defaultOpen={open !== undefined ? undefined : true}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            {closeText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
