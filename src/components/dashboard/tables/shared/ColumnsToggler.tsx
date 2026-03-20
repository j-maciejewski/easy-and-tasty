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
      options={columnNames.map((name) => ({
        label: name,
        value: name,
        checked: !hiddenColumns.includes(name),
      }))}
      toggleOption={toggleColumn}
    >
      <Button className="relative aspect-square">
        <Columns3 className="absolute size-5" />
      </Button>
    </MultiSelect>
  );
};
