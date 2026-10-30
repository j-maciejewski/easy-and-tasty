import { Plus } from "lucide-react";

import { Button } from "@/components/ui";

interface AddButtonProps {
  onClick: () => void;
  label?: string;
}

export const AddButton = ({ onClick, label = "New" }: AddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      aria-label={label}
      className="max-md:size-9 max-md:px-0"
    >
      <Plus className="size-5 stroke-2" />
      <span className="max-md:sr-only">{label}</span>
    </Button>
  );
};
