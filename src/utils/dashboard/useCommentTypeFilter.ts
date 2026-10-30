"use client";

import { useSearchParams } from "next/navigation";

import { useReplaceSearchParams } from "./useReplaceSearchParams";

export type CommentType = "recipe" | "article";

const TYPE_PARAM = "type";

const parseCommentType = (value: string | null): CommentType =>
  value === "article" ? "article" : "recipe";

export const useCommentTypeFilter = () => {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const type = parseCommentType(searchParams.get(TYPE_PARAM));

  const setType = (value: CommentType) => {
    if (value === type) return;

    replaceSearchParams((params) => {
      params.delete("page");
      if (value === "article") params.set(TYPE_PARAM, value);
      else params.delete(TYPE_PARAM);
    });
  };

  return { type, setType };
};
