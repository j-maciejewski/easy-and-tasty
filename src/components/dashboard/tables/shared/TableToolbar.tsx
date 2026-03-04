import { ReactNode } from "react";

interface TableToolbarProps {
  search: ReactNode;
  actions: ReactNode;
}

export const TableToolbar = ({ search, actions }: TableToolbarProps) => {
  return (
    <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
      {search}
      <div className="flex gap-4">{actions}</div>
    </div>
  );
};
