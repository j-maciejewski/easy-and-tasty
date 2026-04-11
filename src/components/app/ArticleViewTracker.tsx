"use client";

import { useEffect, useRef } from "react";

import { api } from "@/trpc/react";

interface ArticleViewTrackerProps {
  articleId: number;
}

export const ArticleViewTracker = ({ articleId }: ArticleViewTrackerProps) => {
  const hasTrackedRef = useRef(false);
  const addArticleView = api.public.article.addArticleView.useMutation();

  useEffect(() => {
    if (hasTrackedRef.current) return;

    hasTrackedRef.current = true;

    addArticleView.mutate({ articleId });
  }, [addArticleView, articleId]);

  return null;
};
