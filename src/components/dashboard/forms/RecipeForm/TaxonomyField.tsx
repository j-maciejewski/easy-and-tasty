import { Plus, X } from "lucide-react";

import { MultiSelect } from "@/components/dashboard/MultiSelect";
import { Badge } from "@/components/ui";

interface TaxonomyFieldProps
  extends Pick<
    React.HTMLAttributes<HTMLDivElement>,
    "id" | "aria-describedby" | "aria-invalid"
  > {
  label: string;
  options: { label: string; value: number }[];
  value: number[];
  onChange: (value: number[]) => void;
}

export const TaxonomyField = ({
  label,
  options,
  value,
  onChange,
  ...props
}: TaxonomyFieldProps) => {
  return (
    <div
      {...props}
      className="flex flex-wrap gap-2 [&>div:last-child]:inline-block"
    >
      {options
        .filter((option) => value.includes(option.value))
        .map((option) => (
          <Badge
            key={option.label}
            variant="outline"
            tabIndex={0}
            className="bg-input cursor-pointer text-nowrap"
            onClick={() => {
              onChange(value.filter((_value) => option.value !== _value));
            }}
          >
            {option.label}
            <X className="text-destructive ml-2 size-4" />
          </Badge>
        ))}
      <MultiSelect
        label={label}
        options={options.map((option) => ({
          ...option,
          checked: value.includes(option.value),
        }))}
        toggleOption={(toggled) => {
          if (value.includes(toggled)) {
            onChange(value.filter((_value) => toggled !== _value));
          } else {
            onChange(value.concat(toggled));
          }
        }}
      >
        <div>
          <Badge variant="outline" className="bg-input h-full cursor-pointer">
            <Plus className="size-3" />
          </Badge>
        </div>
      </MultiSelect>
    </div>
  );
};
