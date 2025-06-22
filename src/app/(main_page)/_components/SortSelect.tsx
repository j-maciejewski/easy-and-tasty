"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui";

export const SortSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "createdAt";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", value);

    router.push(pathname + "?" + params.toString());
  };

  return (
    <Select onValueChange={handleChange} value={sortBy}>
      <SelectTrigger className="w-[180px] bg-white">
        Sort by <Separator orientation="vertical" />{" "}
        <SelectValue placeholder="Newest" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt">Newest</SelectItem>
        <SelectItem value="title">Alphabetical</SelectItem>
      </SelectContent>
    </Select>
  );
};
