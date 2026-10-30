import { ReactNode } from "react";

interface TableToolbarProps {
  search: ReactNode;
  actions: ReactNode;
  filters?: ReactNode;
}

export const TableToolbar = ({
  search,
  actions,
  filters,
}: TableToolbarProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {search}
        {filters}
      </div>
      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        {actions}
      </div>
    </div>
  );
};
