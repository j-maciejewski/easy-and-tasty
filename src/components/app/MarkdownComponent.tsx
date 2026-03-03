"use client";

import Markdown from "markdown-to-jsx/react";

export const MarkdownContent = ({ children }: { children: string }) => {
  return <Markdown>{children}</Markdown>;
};
