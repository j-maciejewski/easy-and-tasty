import { Search } from "lucide-react";

import { Input } from "@/components/ui";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ placeholder, value, onChange }: SearchBarProps) => {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-card w-full pl-8"
      />
    </div>
  );
};
