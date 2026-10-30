"use client";

import { useSearchParams } from "next/navigation";

import { useReplaceSearchParams } from "./useReplaceSearchParams";

export type PublishStatus = "published" | "draft";

const STATUS_PARAM = "status";

const parseStatus = (value: string | null): PublishStatus | undefined =>
  value === "published" || value === "draft" ? value : undefined;

export const matchesStatus = (
  publishedAt: Date | string | null | undefined,
  status: PublishStatus | undefined,
) => !status || (status === "published") === !!publishedAt;

export const useStatusFilter = () => {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const status = parseStatus(searchParams.get(STATUS_PARAM));

  const setStatus = (value: PublishStatus | undefined) => {
    if (value === status) return;

    replaceSearchParams((params) => {
      params.delete("page");
      if (value) params.set(STATUS_PARAM, value);
      else params.delete(STATUS_PARAM);
    });
  };

  const clearStatus = () => setStatus(undefined);

  return { status, setStatus, clearStatus };
};
