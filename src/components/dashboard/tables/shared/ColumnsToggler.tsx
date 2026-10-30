import { Columns3 } from "lucide-react";

import { Button } from "@/components/ui";

import { MultiSelect } from "../../MultiSelect";

interface ColumnsTogglerProps<T extends string> {
  columnNames: T[];
  hiddenColumns: T[];
  toggleColumn: (label: T) => void;
}

export const ColumnsToggler = <T extends string>({
  columnNames,
  hiddenColumns,
  toggleColumn,
}: ColumnsTogglerProps<T>) => {
  return (
    <MultiSelect
      label="Columns"
      options={columnNames.map((name) => ({
        label: name,
        value: name,
        checked: !hiddenColumns.includes(name),
      }))}
      toggleOption={toggleColumn}
    >
      <Button
        variant="outline"
        size="icon"
        className="bg-card"
        aria-label="Toggle columns"
      >
        <Columns3 className="size-5" />
      </Button>
    </MultiSelect>
  );
};
