"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useRef } from "react";
import { ControllerRenderProps } from "react-hook-form";

import type { RecipeFormValues } from "./types";

interface ContentEditorProps
  extends Pick<
    React.HTMLAttributes<HTMLDivElement>,
    "id" | "aria-describedby" | "aria-invalid"
  > {
  field: ControllerRenderProps<RecipeFormValues, "content">;
}

export const ContentEditor = ({ field, ...props }: ContentEditorProps) => {
  const richTextRef = useRef<ReactCodeMirrorRef>(null);

  return (
    <CodeMirror
      {...props}
      {...field}
      className="ring-offset-background focus-visible:ring-ring [&>div]:bg-input! overflow-hidden rounded-lg border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&>div]:outline-0!"
      height="480px"
      extensions={[markdown({ base: markdownLanguage })]}
      theme="dark"
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
      }}
      ref={richTextRef}
      onPaste={async (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        const dataTransfer = evt.clipboardData;

        if (dataTransfer?.items) {
          for (const item of dataTransfer.items) {
            if (item.kind === "file" && item.type.startsWith("image/")) {
              const file = item.getAsFile();

              if (file && richTextRef.current?.view) {
                const formData = new FormData();

                formData.append("file", file);

                const response = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                const message = (await response.json()) as
                  | {
                      data: {
                        name: string;
                        url: string;
                      };
                      error: null;
                    }
                  | { data: null; error: string };

                if (message.data) {
                  const transaction = richTextRef.current.view.state.update({
                    changes: {
                      from: richTextRef.current.view.state.selection.main.head,
                      insert: `![${message.data.name}](${message.data.url})`,
                    },
                  });

                  richTextRef.current.view.dispatch(transaction);
                } else {
                  console.log(message.error);
                }
              }

              break;
            }
          }
        }
      }}
    />
  );
};
