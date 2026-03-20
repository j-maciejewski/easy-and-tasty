import { Plus } from "lucide-react";

import { Button } from "@/components/ui";

interface AddButtonProps {
  onClick: () => void;
}

export const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <Button className="relative aspect-square" onClick={onClick}>
      <Plus className="absolute size-5 stroke-2 text-foreground" />
    </Button>
  );
};
