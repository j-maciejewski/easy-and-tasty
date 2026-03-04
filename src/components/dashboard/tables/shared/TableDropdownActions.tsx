import { DropdownActions as BaseDropdownActions } from "@/components/dashboard";
import { DropdownMenuItem } from "@/components/ui";

export interface TableAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface TableDropdownActionsProps {
  actions: TableAction[];
}

export const TableDropdownActions = ({
  actions,
}: TableDropdownActionsProps) => {
  return (
    <BaseDropdownActions>
      {actions.map((action, index) => (
        <DropdownMenuItem
          key={index}
          onClick={action.onClick}
          className={action.variant === "destructive" ? "text-red-600" : ""}
        >
          {action.label}
        </DropdownMenuItem>
      ))}
    </BaseDropdownActions>
  );
};
